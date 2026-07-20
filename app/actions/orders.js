'use server'

import { createClient } from '@/lib/supabase/server'

export async function trackOrder(orderId) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Authentication required')

  const cleanOrderId = orderId.replace(/^#/, '').trim()

  const { data, error } = await supabase
    .from('orders')
    .select('id, status, created_at, tracking_number, updated_at')
    .ilike('id', `${cleanOrderId}%`)
    .eq('user_id', user.id)
    .single()

  if (error || !data) throw new Error('Order not found or access denied.')

  return data
}