'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createOrder(orderPayload) {
  const supabase = await createClient()

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) throw new Error("Unauthorized")

    const variantIds = orderPayload.items.map(item => item.variantId);
    const { data: variants, error: variantError } = await supabase
      .from('product_variants')
      .select('id, inventory_count, products(base_price)')
      .in('id', variantIds);

    if (variantError || !variants) throw new Error("Failed to validate items");

    let serverTotalAmount = 0;
    const orderItems = [];

    for (const item of orderPayload.items) {
      const dbVariant = variants.find(v => v.id === item.variantId);
      if (!dbVariant) throw new Error(`Invalid item: ${item.variantId}`);
      if (dbVariant.inventory_count < item.quantity) throw new Error("Out of stock");

      const realPrice = dbVariant.products.base_price; 
      serverTotalAmount += (realPrice * item.quantity);

      orderItems.push({
        variant_id: item.variantId,
        quantity: item.quantity,
        price: realPrice 
      });
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: serverTotalAmount, 
        payment_method: orderPayload.paymentMethod,
        payment_status: orderPayload.paymentStatus || 'Pending',
        status: orderPayload.status || 'pending',
        shipping_address: orderPayload.address
      })
      .select()
      .single()

    if (orderError) throw new Error("Failed to create order")

    const itemsToInsert = orderItems.map(item => ({ ...item, order_id: order.id }));
    const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert)

    if (itemsError) throw new Error("Failed to save order items")

    revalidatePath('/account/orders')
    
    return { success: true, data: order }

  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function getUserOrders() {
  const supabase = await createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: orders, error } = await supabase
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
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!orders || orders.length === 0) return [];

    const itemIds = [...new Set(orders.flatMap(o => o.order_items?.map(i => i.variant_id).filter(Boolean)))];

    const { data: products } = await supabase
      .from('products')
      .select('id, title, product_images(image_url)')
      .in('id', itemIds);

    const { data: variants } = await supabase
      .from('product_variants')
      .select('id, size, products(title, product_images(image_url))')
      .in('id', itemIds);

    const formattedOrders = orders.map(order => ({
      ...order,
      order_items: order.order_items.map(item => {
        const variantMatch = variants?.find(v => v.id === item.variant_id);
        const productMatch = products?.find(p => p.id === item.variant_id);
        
        const imageUrl = variantMatch?.products?.product_images?.[0]?.image_url || 
                         productMatch?.product_images?.[0]?.image_url || 
                         null;

        return {
          ...item,
          image_url: imageUrl,
          product_variants: {
            size: variantMatch ? variantMatch.size : 'Standard',
            products: {
              title: variantMatch?.products?.title || productMatch?.title || 'Premium Product',
              product_images: imageUrl ? [{ image_url: imageUrl }] : []
            }
          }
        };
      })
    }));

    return formattedOrders;
  } catch (error) {
    return [];
  }
}

export async function trackOrder(orderId) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Authentication required')

  const cleanOrderId = orderId.replace(/^#/, '').trim()

  const { data, error } = await supabase
    .from('orders')
    .select('id, status, created_at, tracking_number, updated_at')
    .eq('id', cleanOrderId) 
    .eq('user_id', user.id)
    .single()

  if (error || !data) throw new Error('Order not found or access denied.')

  return data
}