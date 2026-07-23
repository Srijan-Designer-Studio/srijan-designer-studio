'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createOrder(orderPayload) {
  const supabase = await createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user ? user.id : null,
        total_amount: orderPayload.totalAmount,
        payment_method: orderPayload.paymentMethod,
        payment_status: orderPayload.paymentStatus || 'Pending',
        status: orderPayload.status || 'pending',
        shipping_address: orderPayload.address 
      })
      .select()
      .single()

    if (orderError) throw new Error(orderError.message)

    const orderItems = orderPayload.items.map(item => ({
      order_id: order.id,
      variant_id: item.variantId,
      quantity: item.quantity,
      price: item.unitPrice
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw new Error(itemsError.message)

    revalidatePath('/account/orders')
    
    return { success: true, data: order }

  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function getUserOrders() {
  const supabase = await createClient()

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) return []

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          quantity,
          price,
          product_variants (
            size,
            products (
              title
            )
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    return []
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
    .ilike('id', `${cleanOrderId}%`)
    .eq('user_id', user.id)
    .single()

  if (error || !data) throw new Error('Order not found or access denied.')

  return data
}