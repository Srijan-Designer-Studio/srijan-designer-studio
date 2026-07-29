'use server'

import { createClient } from '@/lib/supabase/server'

export async function getProducts() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*, product_variants(*), product_images(*), categories(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }
  return data || []
}

export async function getProductBySlug(slug) {
  if (!slug) return null

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*, product_variants(*), product_images(*), categories(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (error) {
    console.error("Error fetching product by slug:", error)
    return null
  }
  return data
}

export async function getProductsByCategory(categoryName) {
  const supabase = await createClient()

  try {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .ilike('name', categoryName)
      .maybeSingle()
      
    if (!category) return []

    const { data, error } = await supabase
      .from('products')
      .select('*, product_variants(*), product_images(*), categories(*)')
      .eq('category_id', category.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching products by category:", error)
    return []
  }
}