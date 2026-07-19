'use server'

import { createClient } from '@/lib/supabase/server'

export async function searchProducts({
  searchTerm = '',
  categorySlug = null,
  minPrice = 0,
  maxPrice = 100000,
  sizes = [],
  colors = [],
  sortBy = 'newest', // 'newest', 'price_asc', 'price_desc'
  page = 1,
  limit = 12
}) {
  const supabase = await createClient()
  
  // Calculate pagination range
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('products')
    .select(`
      *,
      categories!inner(slug),
      product_images (image_url, alt_text, display_order),
      product_variants!inner(size, color)
    `, { count: 'exact' })
    .eq('is_active', true)

  // 1. Text Search
  if (searchTerm) {
    query = query.ilike('title', `%${searchTerm}%`)
  }

  // 2. Category Filter
  if (categorySlug) {
    query = query.eq('categories.slug', categorySlug)
  }

  // 3. Price Filter
  query = query.gte('base_price', minPrice).lte('base_price', maxPrice)

  // 4. Variant Filters (Size/Color)
  if (sizes.length > 0) {
    query = query.in('product_variants.size', sizes)
  }
  if (colors.length > 0) {
    query = query.in('product_variants.color', colors)
  }

  // 5. Sorting
  if (sortBy === 'price_asc') {
    query = query.order('base_price', { ascending: true })
  } else if (sortBy === 'price_desc') {
    query = query.order('base_price', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false }) // newest
  }

  // 6. Pagination
  query = query.range(from, to)

  const { data, count, error } = await query

  if (error) throw new Error(error.message)

  // Deduplicate products (since joining variants can cause multiple rows per product)
  const uniqueProducts = Array.from(new Map(data.map(p => [p.id, p])).values())

  return {
    products: uniqueProducts,
    totalCount: count,
    totalPages: Math.ceil((count || 0) / limit),
    currentPage: page
  }
}