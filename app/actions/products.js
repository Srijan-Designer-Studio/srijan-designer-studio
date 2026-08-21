'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export async function getProducts() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('products')
    .select('*, product_variants(*), product_images(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching products:", error.message || JSON.stringify(error, null, 2))
    return []
  }
  return data || []
}

export async function getProductBySlug(slug) {
  if (!slug) return null

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('products')
    // CRITICAL FIX: Removed categories!category_id(*) so it doesn't overwrite our new JSONB array
    .select('*, product_variants(*), product_images(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (error) {
    console.error("Error fetching product by slug:", error.message || JSON.stringify(error, null, 2))
    return null
  }
  return data
}

export async function getProductsByCategory(categoryName) {
  const supabase = createAdminClient()

  try {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .ilike('name', categoryName)
      .maybeSingle()

    if (!category) return []

    const { data, error } = await supabase
      .from('products')
      // CRITICAL FIX: Removed categories!category_id(*)
      .select('*, product_variants(*), product_images(*)')
      .eq('category_id', category.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching products by category:", error?.message || JSON.stringify(error, null, 2))
    return []
  }
}