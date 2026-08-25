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

  if (searchTerm && searchTerm.trim().length > 0) {
    const cleanTerm = searchTerm.trim().toLowerCase();
    const { data: existingKeyword } = await supabase
      .from('search_keywords')
      .select('id, searches')
      .eq('keyword', cleanTerm)
      .single();

    if (existingKeyword) {
      await supabase
        .from('search_keywords')
        .update({ searches: (existingKeyword.searches || 0) + 1 })
        .eq('id', existingKeyword.id);
    } else {
      await supabase
        .from('search_keywords')
        .insert({ keyword: cleanTerm, searches: 1, is_active: true, conversion_rate: 0 });
    }
  }

  let matchingCategoryIds = []
  if (searchTerm) {
    const { data: categories } = await supabase
      .from('categories')
      .select('id')
      .ilike('name', `%${searchTerm}%`)

    if (categories && categories.length > 0) {
      matchingCategoryIds = categories.map(c => c.id)
    }
  }

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
    let orQuery = `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,tags.ilike.%${searchTerm}%,keywords.ilike.%${searchTerm}%`

    if (matchingCategoryIds.length > 0) {
      orQuery += `,category_id.in.(${matchingCategoryIds.join(',')})`
    }

    query = query.or(orQuery)
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

  if (error) {
    throw new Error(error.message)
  }

  const uniqueProducts = Array.from(new Map(data.map(p => [p.id, p])).values())

  return {
    products: uniqueProducts,
    totalCount: count,
    totalPages: Math.ceil((count || 0) / limit),
    currentPage: page
  }
}