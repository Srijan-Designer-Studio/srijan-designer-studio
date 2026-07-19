'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createOrder(checkoutData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Authentication required')

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      shipping_address_id: checkoutData.addressId,
      total_amount: checkoutData.totalAmount,
      status: 'pending',
      payment_status: 'pending'
    })
    .select()
    .single()

  if (orderError) throw new Error(orderError.message)

  const orderItems = checkoutData.items.map(item => ({
    order_id: order.id,
    variant_id: item.variantId,
    quantity: item.quantity,
    unit_price: item.unitPrice
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) throw new Error(itemsError.message)

  await supabase
    .from('cart_items')
    .delete()
    .in('variant_id', checkoutData.items.map(i => i.variantId))

  revalidatePath('/account/orders')
  return { success: true, orderId: order.id }
}

export async function getUserOrders() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        quantity,
        unit_price,
        product_variants (
          size,
          color,
          products (title, slug)
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}