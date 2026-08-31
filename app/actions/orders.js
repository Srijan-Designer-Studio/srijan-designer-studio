'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { trackShiprocketOrder } from '@/lib/utils/shiprocket'

export async function createOrder(orderPayload) {
  try {
    const supabase = await createClient()
    const adminDb = createAdminClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) throw new Error("Unauthorized")

    const itemIds = orderPayload.items.map(item => item.variantId)

    // Reverted to select only existing columns to prevent schema errors
    const { data: variants } = await adminDb
      .from('product_variants')
      .select('id, product_id, inventory_count, products(base_price)')
      .in('id', itemIds)

    const { data: baseProducts } = await adminDb
      .from('products')
      .select('id, base_price')
      .in('id', itemIds)

    let serverTotalAmount = 0
    const orderItems = []

    for (const item of orderPayload.items) {
      const dbVariant = variants?.find(v => v.id === item.variantId)
      const dbBaseProduct = baseProducts?.find(p => p.id === item.variantId)

      if (!dbVariant && !dbBaseProduct) {
        throw new Error(`Invalid item: ${item.variantId}`)
      }

      if (dbVariant) {
        if (dbVariant.inventory_count < item.quantity) throw new Error("Out of stock")
      }

      // Use the actual offer price sent from the frontend cart to avoid full base_price bill
      const realPrice = Number(item.unitPrice) || 0

      serverTotalAmount += (realPrice * item.quantity)

      orderItems.push({
        variant_id: item.variantId,
        quantity: item.quantity,
        price: realPrice
      })
    }

    const { data: order, error: orderError } = await adminDb
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: serverTotalAmount,
        payment_method: orderPayload.paymentMethod,
        payment_status: orderPayload.paymentStatus || 'Pending',
        status: orderPayload.status || 'pending',
        shipping_address: orderPayload.address,
        customer_phone: orderPayload.customer_phone
      })
      .select()
      .single()

    if (orderError) throw new Error(`DB Error: ${orderError.message}`)

    const itemsToInsert = orderItems.map(item => ({ ...item, order_id: order.id }))
    const { error: itemsError } = await adminDb.from('order_items').insert(itemsToInsert)

    if (itemsError) throw new Error(`Items Error: ${itemsError.message}`)

    for (const item of orderPayload.items) {
      const dbVariant = variants?.find(v => v.id === item.variantId)
      const productId = dbVariant ? dbVariant.product_id : item.variantId

      if (productId) {
        const { data: productStats } = await adminDb
          .from('products')
          .select('purchase_count, stock_quantity')
          .eq('id', productId)
          .single()

        if (productStats) {
          await adminDb
            .from('products')
            .update({
              purchase_count: (productStats.purchase_count || 0) + item.quantity,
              stock_quantity: Math.max(0, (productStats.stock_quantity || 0) - item.quantity)
            })
            .eq('id', productId)
        }

        if (dbVariant) {
          await adminDb
            .from('product_variants')
            .update({
              inventory_count: Math.max(0, (dbVariant.inventory_count || 0) - item.quantity)
            })
            .eq('id', dbVariant.id)
        }
      }
    }

    revalidatePath('/account/orders')

    return { success: true, data: order, orderId: order.id, id: order.id }

  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function getUserOrders() {
  try {
    const supabase = await createClient()
    const adminDb = createAdminClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) return []

    const { data: orders, error } = await adminDb
      .from('orders')
      .select(`
        *,
        order_items (
          variant_id,
          quantity,
          price
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    if (!orders || orders.length === 0) return []

    const itemIds = [...new Set(orders.flatMap(o => o.order_items?.map(i => i.variant_id).filter(Boolean)))]

    // এখানেই মূল পরিবর্তন: select() এর ভেতরে is_return_eligible যুক্ত করা হয়েছে
    const { data: products } = await adminDb
      .from('products')
      .select('id, title, slug, is_return_eligible, product_images(image_url)') 
      .in('id', itemIds)

    // এখানেও is_return_eligible যুক্ত করা হয়েছে
    const { data: variants } = await adminDb
      .from('product_variants')
      .select('id, size, products(title, slug, is_return_eligible, product_images(image_url))')
      .in('id', itemIds)

    const formattedOrders = orders.map(order => ({
      ...order,
      order_items: order.order_items.map(item => {
        const variantMatch = variants?.find(v => v.id === item.variant_id)
        const productMatch = products?.find(p => p.id === item.variant_id)

        const imageUrl = variantMatch?.products?.product_images?.[0]?.image_url ||
          productMatch?.product_images?.[0]?.image_url ||
          null
          
        // প্রোডাক্টের রিটার্ন স্ট্যাটাস চেক করা হচ্ছে
        const isReturnEligible = variantMatch?.products?.is_return_eligible ?? productMatch?.is_return_eligible ?? false

        return {
          ...item,
          image_url: imageUrl,
          product_variants: {
            size: variantMatch ? variantMatch.size : 'Standard',
            products: {
              title: variantMatch?.products?.title || productMatch?.title || 'Premium Product',
              slug: variantMatch?.products?.slug || productMatch?.slug || null,
              is_return_eligible: isReturnEligible, // ফ্রন্টএন্ডে পাঠানোর জন্য ডাটা যুক্ত করা হলো
              product_images: imageUrl ? [{ image_url: imageUrl }] : []
            }
          }
        }
      })
    }))

    return formattedOrders
  } catch (error) {
    return []
  }
}
export async function trackOrder(orderId) {
  try {
    const supabase = await createClient()
    const adminDb = createAdminClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) throw new Error('Authentication required')

    const cleanOrderId = orderId.replace(/^#/, '').trim()

    const { data, error } = await adminDb
      .from('orders')
      .select('id, status, created_at, tracking_number, updated_at')
      .eq('id', cleanOrderId)
      .eq('user_id', user.id)
      .single()

    if (error || !data) throw new Error('Order not found or access denied.')

    let liveTracking = null;
    if (data.tracking_number) {
       const shiprocketData = await trackShiprocketOrder(data.tracking_number);
       if(shiprocketData && shiprocketData.tracking_data) {
           liveTracking = shiprocketData.tracking_data;
       }
    }

    return { ...data, liveTracking }
  } catch (error) {
    throw new Error(error.message)
  }
}

export async function updateOrderUserAction(orderId, actionType) {
  try {
    const supabase = await createClient();
    const adminDb = createAdminClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized');

    const { data: order, error: fetchError } = await adminDb
      .from('orders')
      .select('id, status')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !order) throw new Error('Order not found.');

    let newStatus = '';
    
    if (actionType === 'cancelled' && ['pending', 'processing'].includes(order.status.toLowerCase())) {
       newStatus = 'cancelled';
    } else if (actionType === 'return_requested' && order.status.toLowerCase() === 'delivered') {
       newStatus = 'return_requested';
    } else {
       throw new Error(`Cannot perform this action in current status.`);
    }

    const { error: updateError } = await adminDb
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (updateError) throw updateError;

    revalidatePath('/account/orders'); 
    return { success: true, message: `Request submitted successfully.` };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function deleteFailedOrder(orderId) {
  try {
    const adminDb = createAdminClient()

    const { data: orderItems } = await adminDb
      .from('order_items')
      .select('variant_id, quantity')
      .eq('order_id', orderId)

    if (orderItems && orderItems.length > 0) {
      for (const item of orderItems) {
        const { data: variant } = await adminDb
          .from('product_variants')
          .select('product_id, inventory_count')
          .eq('id', item.variant_id)
          .single()

        if (variant) {
          await adminDb
            .from('product_variants')
            .update({ inventory_count: (variant.inventory_count || 0) + item.quantity })
            .eq('id', item.variant_id)

          const { data: product } = await adminDb
            .from('products')
            .select('stock_quantity, purchase_count')
            .eq('id', variant.product_id)
            .single()

          if (product) {
            await adminDb
              .from('products')
              .update({
                stock_quantity: (product.stock_quantity || 0) + item.quantity,
                purchase_count: Math.max(0, (product.purchase_count || 0) - item.quantity)
              })
              .eq('id', variant.product_id)
          }
        } else {
          const { data: product } = await adminDb
            .from('products')
            .select('stock_quantity, purchase_count')
            .eq('id', item.variant_id)
            .single()

          if (product) {
            await adminDb
              .from('products')
              .update({
                stock_quantity: (product.stock_quantity || 0) + item.quantity,
                purchase_count: Math.max(0, (product.purchase_count || 0) - item.quantity)
              })
              .eq('id', item.variant_id)
          }
        }
      }
    }

    await adminDb.from('order_items').delete().eq('order_id', orderId)
    await adminDb.from('orders').delete().eq('id', orderId)
    
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
