'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function getCart() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) return null

    const adminDb = createAdminClient()
    const { data, error } = await adminDb
      .from('cart')
      .select(`
        id,
        cart_items (
          id,
          quantity,
          variant_id,
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

    if (error && error.code !== 'PGRST116') return null
    return data
  } catch (error) {
    return null
  }
}

export async function getWishlist() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) return null

    const adminDb = createAdminClient()
    const { data, error } = await adminDb
      .from('wishlist')
      .select(`
        id,
        product_id,
        products (
          id,
          title,
          slug,
          base_price,
          is_active,
          product_images (image_url)
        )
      `)
      .eq('user_id', user.id)

    if (error) return null
    return data
  } catch (error) {
    return null
  }
}

export async function addToCart(variantId, quantity) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'Authentication required' }
    }

    const adminDb = createAdminClient()

    let { data: cart } = await adminDb
      .from('cart')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!cart) {
      const { data: newCart, error: cartError } = await adminDb
        .from('cart')
        .insert({ user_id: user.id })
        .select()
        .single()

      if (cartError) return { success: false, error: cartError.message }
      cart = newCart
    }

    const { error } = await adminDb
      .from('cart_items')
      .upsert({
        cart_id: cart.id,
        variant_id: variantId,
        quantity: quantity
      }, { onConflict: 'cart_id, variant_id' })

    if (error) return { success: false, error: error.message }

    const { data: variantData } = await adminDb
      .from('product_variants')
      .select('product_id')
      .eq('id', variantId)
      .single()

    if (variantData?.product_id) {
      const { data: productData } = await adminDb
        .from('products')
        .select('cart_count')
        .eq('id', variantData.product_id)
        .single()

      if (productData) {
        await adminDb
          .from('products')
          .update({ cart_count: (productData.cart_count || 0) + 1 })
          .eq('id', variantData.product_id)
      }
    }

    revalidatePath('/cart')
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function removeFromCartDB(variantId) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) return { success: false, error: 'Authentication required' }

    const adminDb = createAdminClient()
    
    const { data: cart } = await adminDb
      .from('cart')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!cart) return { success: false, error: 'Cart not found' }

    const { error } = await adminDb
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id)
      .eq('variant_id', variantId)

    if (error) return { success: false, error: error.message }

    revalidatePath('/cart')
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function updateCartQuantityDB(variantId, quantity) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) return { success: false, error: 'Authentication required' }

    const adminDb = createAdminClient()
    
    const { data: cart } = await adminDb
      .from('cart')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!cart) return { success: false, error: 'Cart not found' }

    const { error } = await adminDb
      .from('cart_items')
      .update({ quantity })
      .eq('cart_id', cart.id)
      .eq('variant_id', variantId)

    if (error) return { success: false, error: error.message }

    revalidatePath('/cart')
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function toggleWishlist(productId) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'Authentication required' }
    }

    const adminDb = createAdminClient()

    const { data: existing } = await adminDb
      .from('wishlist')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single()

    if (existing) {
      await adminDb.from('wishlist').delete().eq('id', existing.id)
    } else {
      await adminDb.from('wishlist').insert({ user_id: user.id, product_id: productId })

      const { data: productData } = await adminDb
        .from('products')
        .select('wishlist_count')
        .eq('id', productId)
        .single()

      if (productData) {
        await adminDb
          .from('products')
          .update({ wishlist_count: (productData.wishlist_count || 0) + 1 })
          .eq('id', productId)
      }
    }

    revalidatePath('/wishlist')
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}