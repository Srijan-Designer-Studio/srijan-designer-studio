'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function getCart() {
  const supabase = createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('cart')
    .select(`
      id,
      cart_items (
        id,
        quantity,
        product_variants (
          id,
          size,
          color,
          price_adjustment,
          products (
            id,
            title,
            slug,
            base_price,
            product_images (image_url)
          )
        )
      )
    `)
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') throw new Error(error.message)
  return data
}

export async function addToCart(variantId, quantity) {
  const supabase = createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Authentication required')

  let { data: cart } = await supabase
    .from('cart')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!cart) {
    const { data: newCart, error: cartError } = await supabase
      .from('cart')
      .insert({ user_id: user.id })
      .select()
      .single()

    if (cartError) throw new Error(cartError.message)
    cart = newCart
  }

  const { error } = await supabase
    .from('cart_items')
    .upsert({
      cart_id: cart.id,
      variant_id: variantId,
      quantity: quantity
    }, { onConflict: 'cart_id, variant_id' })

  if (error) throw new Error(error.message)

  revalidatePath('/cart')
  return { success: true }
}

export async function toggleWishlist(productId) {
  const supabase = createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Authentication required')

  const { data: existing } = await supabase
    .from('wishlist')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .single()

  if (existing) {
    await supabase.from('wishlist').delete().eq('id', existing.id)
  } else {
    await supabase.from('wishlist').insert({ user_id: user.id, product_id: productId })
  }

  revalidatePath('/wishlist')
  return { success: true }
}