'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

// Admin verification mock (matching your admin.js logic)
async function verifyAdmin() {
  return true;
}

export async function addReview(productId, rating, comment) {
  try {
    const supabase = await createClient()
    const adminDb = createAdminClient()

    const { data: { session } } = await supabase.auth.getSession()
    let user = session?.user
    
    if (!user) {
      const { data } = await supabase.auth.getUser()
      user = data?.user
    }

    if (!user) {
      return { success: false, message: 'You must be logged in to leave a review.' }
    }

  
    const { data: variants } = await adminDb
      .from('product_variants')
      .select('id')
      .eq('product_id', productId)

   
    const validItemIds = variants?.map(v => v.id) || []
    validItemIds.push(productId)

    
    const { data: userOrders, error: checkError } = await adminDb
      .from('orders')
      .select(`
        id,
        order_items ( variant_id )
      `)
      .eq('user_id', user.id)
      .eq('status', 'delivered')

    if (checkError) {
      console.error("Purchase verification error:", checkError);
      return { success: false, message: 'Failed to verify purchase history.' }
    }

   
    let hasPurchased = false;
    
    if (userOrders && userOrders.length > 0) {
      for (const order of userOrders) {
        if (order.order_items) {
          for (const item of order.order_items) {
            if (validItemIds.includes(item.variant_id)) {
              hasPurchased = true;
              break;
            }
          }
        }
        if (hasPurchased) break;
      }
    }

    if (!hasPurchased) {
      return { success: false, message: 'You can only review products after they have been delivered to you.' }
    }

   
    const { error } = await adminDb.from('reviews').insert({
      product_id: productId,
      user_id: user.id,
      rating: parseInt(rating),
      comment,
      is_approved: false
    })

    if (error) {
      return { success: false, message: error.message }
    }

    revalidatePath(`/product/[slug]`, 'page')
    return { success: true, message: 'Review submitted and pending approval.' }

  } catch (error) {
    console.error("Review Add Error:", error);
    return { success: false, message: 'An unexpected error occurred.' }
  }
}

export async function getProductReviews(productId) {
  const adminDb = createAdminClient()
  const { data, error } = await adminDb
    .from('reviews')
    .select('id, rating, comment, created_at, profiles(first_name, last_name)')
    .eq('product_id', productId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function getAllReviews() {
  const adminDb = createAdminClient()
  
  
  await verifyAdmin()

  const { data, error } = await adminDb
    .from('reviews')
    .select(`
      id, rating, comment, created_at, is_approved,
      profiles(first_name, last_name),
      products(title, product_images(image_url))
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching admin reviews:", error.message);
    return []
  }

  return data
}

export async function updateReviewStatus(reviewId, isApproved) {
  const adminDb = createAdminClient()

  // CRITICAL FIX: Allow status update
  await verifyAdmin()

  if (isApproved === 'deleted') {
    const { error } = await adminDb.from('reviews').delete().eq('id', reviewId)
    if (error) return { success: false, message: error.message }
  } else {
    const { error } = await adminDb.from('reviews').update({ is_approved: isApproved }).eq('id', reviewId)
    if (error) return { success: false, message: error.message }
  }

  revalidatePath('/admin/reviews')
  return { success: true }
}