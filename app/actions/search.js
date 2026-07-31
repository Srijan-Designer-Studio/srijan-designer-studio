'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export async function searchProducts({
  searchTerm = '',
  categorySlug = null,
  minPrice = 0,
  maxPrice = 100000,
  sizes = [],
  colors = [],
  sortBy = 'newest',
  page = 1,
  limit = 12
}) {
  const supabase = createAdminClient()

  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('products')
    .select(`
      *,
      categories!inner(slug),
      product_images (image_url, display_order),
      product_variants!inner(size, color)
    `, { count: 'exact' })
    .eq('is_active', true)

  if (searchTerm) {
    query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
  }

  if (categorySlug) {
    query = query.eq('categories.slug', categorySlug)
  }

  query = query.gte('base_price', minPrice).lte('base_price', maxPrice)

  if (sizes.length > 0) {
    query = query.in('product_variants.size', sizes)
  }

  if (colors.length > 0) {
    query = query.in('product_variants.color', colors)
  }

  if (sortBy === 'price_asc') {
    query = query.order('base_price', { ascending: true })
  } else if (sortBy === 'price_desc') {
    query = query.order('base_price', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  query = query.range(from, to)

  const { data, count, error } = await query

  if (error) throw new Error(error.message)

  const uniqueProducts = Array.from(new Map(data.map(p => [p.id, p])).values())

  return {
    products: uniqueProducts,
    totalCount: count,
    totalPages: Math.ceil((count || 0) / limit),
    currentPage: page
  }
}