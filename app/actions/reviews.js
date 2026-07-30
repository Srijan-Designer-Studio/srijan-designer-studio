'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addReview(productId, rating, comment) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('You must be logged in to leave a review.')

  const { data: hasPurchased } = await supabase
    .from('orders')
    .select('order_items!inner(variant_id, product_variants!inner(product_id))')
    .eq('user_id', user.id)
    .eq('order_items.product_variants.product_id', productId)
    .limit(1)

  if (!hasPurchased || hasPurchased.length === 0) {
    throw new Error('You can only review products you have purchased.')
  }

  const { error } = await supabase.from('reviews').insert({
    product_id: productId,
    user_id: user.id,
    rating: parseInt(rating),
    comment,
    is_approved: false 
  })

  if (error) throw new Error(error.message)

  revalidatePath(`/product/[slug]`, 'page')
  return { success: true, message: 'Review submitted and pending approval.' }
}

export async function getProductReviews(productId) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('id, rating, comment, created_at, profiles(first_name, last_name)')
    .eq('product_id', productId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

// --- ADMIN FUNCTIONS ---

export async function getAllReviews() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // ইমেইলে 'admin' লেখা থাকলেই তাকে অ্যাডমিন হিসেবে ধরে নেবে
  const isAdmin = user && (user.email?.includes('admin') || user.user_metadata?.role === 'admin')
  
  // পেজ ক্র্যাশ না করানোর জন্য Error থ্রো এর বদলে ফাঁকা Array রিটার্ন করা হলো
  if (!isAdmin) return []

  const { data, error } = await supabase
    .from('reviews')
    .select(`
      id, rating, comment, created_at, is_approved,
      profiles(first_name, last_name),
      products(title, product_images(image_url))
    `)
    .order('created_at', { ascending: false })

  if (error) return []
  
  return data
}

export async function updateReviewStatus(reviewId, isApproved) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user && (user.email?.includes('admin') || user.user_metadata?.role === 'admin')
  
  if (!isAdmin) return { success: false, message: 'Unauthorized' }

  if (isApproved === 'deleted') {
    const { error } = await supabase.from('reviews').delete().eq('id', reviewId)
    if (error) return { success: false, message: error.message }
  } else {
    const { error } = await supabase.from('reviews').update({ is_approved: isApproved }).eq('id', reviewId)
    if (error) return { success: false, message: error.message }
  }

  revalidatePath('/admin/reviews')
  return { success: true }
}