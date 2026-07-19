'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function verifyAdmin(supabase) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.user_metadata?.role !== 'admin') {
    throw new Error('Unauthorized')
  }
}

export async function getAllOrders() {
  const supabase = await createClient()
  await verifyAdmin(supabase)

  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      total_amount,
      status,
      created_at,
      profiles (first_name, last_name, auth_users(email))
    `)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function updateOrderStatus(orderId, status) {
  const supabase = await createClient()
  await verifyAdmin(supabase)

  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/orders')
  return { success: true }
}

export async function getDashboardStats() {
  const supabase = await createClient()
  await verifyAdmin(supabase)

  const { count: orderCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })

  const { count: customerCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'customer')

  const { data: revenueData } = await supabase
    .from('orders')
    .select('total_amount')
    .eq('status', 'delivered')

  const totalRevenue = revenueData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0

  return {
    totalOrders: orderCount,
    totalCustomers: customerCount,
    totalRevenue
  }
}