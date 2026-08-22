'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { trackShiprocketOrder } from '@/lib/utils/shiprocket'

export async function createOrder(orderPayload) {
  try {
    const supabase = await createClient()
    const adminDb = createAdminClient()

    const { data: { session } } = await supabase.auth.getSession()
    let user = session?.user
    
    if (!user) {
      const { data } = await supabase.auth.getUser()
      user = data?.user
    }

    if (!user) throw new Error("Unauthorized")

    const itemIds = orderPayload.items.map(item => item.variantId)

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

      let realPrice = 0

      if (dbVariant) {
        if (dbVariant.inventory_count < item.quantity) throw new Error("Out of stock")
        realPrice = dbVariant.products?.base_price || 0
      } else if (dbBaseProduct) {
        realPrice = dbBaseProduct.base_price || 0
      }

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

    return { success: true, data: order }

  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function getUserOrders() {
  try {
    const supabase = await createClient()
    const adminDb = createAdminClient()

    const { data: { session } } = await supabase.auth.getSession()
    let user = session?.user
    
    if (!user) {
      const { data } = await supabase.auth.getUser()
      user = data?.user
    }

    if (!user) return []

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

    const { data: products } = await adminDb
      .from('products')
      .select('id, title, slug, product_images(image_url)')
      .in('id', itemIds)

    const { data: variants } = await adminDb
      .from('product_variants')
      .select('id, size, products(title, slug, product_images(image_url))')
      .in('id', itemIds)

    const formattedOrders = orders.map(order => ({
      ...order,
      order_items: order.order_items.map(item => {
        const variantMatch = variants?.find(v => v.id === item.variant_id)
        const productMatch = products?.find(p => p.id === item.variant_id)

        const imageUrl = variantMatch?.products?.product_images?.[0]?.image_url ||
          productMatch?.product_images?.[0]?.image_url ||
          null

        return {
          ...item,
          image_url: imageUrl,
          product_variants: {
            size: variantMatch ? variantMatch.size : 'Standard',
            products: {
              title: variantMatch?.products?.title || productMatch?.title || 'Premium Product',
              slug: variantMatch?.products?.slug || productMatch?.slug || null,
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

    const { data: { session } } = await supabase.auth.getSession()
    let user = session?.user
    
    if (!user) {
      const { data } = await supabase.auth.getUser()
      user = data?.user
    }

    if (!user) throw new Error('Authentication required')

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