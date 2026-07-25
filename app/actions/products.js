'use server'

import { createClient } from '@supabase/supabase-js'

// সরাসরি Supabase ক্লায়েন্ট তৈরি করা হচ্ছে
const publicSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function getProducts() {
  const { data, error } = await publicSupabase
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
  const { data, error } = await publicSupabase
    .from('products')
    .select('*, product_variants(*), product_images(*), categories(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error("Error fetching product by slug:", error)
    return null
  }
  return data
}

export async function getProductsByCategory(categoryName) {
  try {
    const { data: category } = await publicSupabase
      .from('categories')
      .select('id')
      .ilike('name', categoryName)
      .single()
      
    if (!category) return []

    const { data, error } = await publicSupabase
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