'use server'

import { createClient } from '@/lib/supabase/server'
import { unstable_cache } from 'next/cache'

// Cached query for product listings
export const getProducts = unstable_cache(
  async (categorySlug = null) => {
    const supabase = await createClient()
    let query = supabase
      .from('products')
      .select(`
        *,
        product_images (image_url, alt_text),
        product_variants (id, size, color, price_adjustment, inventory_count)
      `)
      .eq('is_active', true)

    if (categorySlug) {
      const { data: category } = await supabase.from('categories').select('id').eq('slug', categorySlug).single()
      if (category) query = query.eq('category_id', category.id)
    }

    const { data, error } = await query
    
    if (error) throw new Error(error.message)
    return data
  },
  ['products-list'],
  { revalidate: 3600, tags: ['products'] }
)

// Dynamic query for individual product pages
export async function getProductBySlug(slug) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_images (image_url, alt_text),
        product_variants (id, size, color, sku, inventory_count)
      `)
      .eq('slug', slug)
      .single()

    if (error) return null
    return data
}