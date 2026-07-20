'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateProfile(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Authentication required')

  const { error } = await supabase
    .from('profiles')
    .update({
      first_name: formData.get('firstName'),
      last_name: formData.get('lastName'),
      phone: formData.get('phone')
    })
    .eq('id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/account/profile')
  return { success: true }
}

export async function updatePassword(formData) {
  const supabase = await createClient()
  const newPassword = formData.get('newPassword')
  const confirmPassword = formData.get('confirmPassword')

  if (newPassword !== confirmPassword) {
    throw new Error('New passwords do not match.')
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (error) throw new Error(error.message)

  return { success: true }
}

export async function getCustomerDashboardStats() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name')
    .eq('id', user.id)
    .single()

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      id,
      total_amount,
      status,
      created_at,
      order_items(
        product_variants(
          products(title, product_images(image_url))
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { count: wishlistCount } = await supabase
    .from('wishlist')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const activeOrders = orders?.filter(o => !['delivered', 'cancelled', 'returned'].includes(o.status)) || []

  return {
    firstName: profile?.first_name || 'Guest',
    totalOrders: orders?.length || 0,
    pendingOrders: orders?.filter(o => o.status === 'pending').length || 0,
    deliveredOrders: orders?.filter(o => o.status === 'delivered').length || 0,
    returnRequests: orders?.filter(o => o.status === 'returned').length || 0,
    wishlistCount: wishlistCount || 0,
    recentOrders: orders?.slice(0, 5) || [],
    activeTrackingOrder: activeOrders[0] || null
  }
}