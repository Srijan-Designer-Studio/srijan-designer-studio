'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getKeywords() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('search_keywords')
    .select('*')
    .order('searches', { ascending: false })

  if (error) {
    console.error("Error fetching keywords:", error)
    return []
  }
  return data
}

export async function addKeyword(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user || user.user_metadata?.role !== 'admin') throw new Error('Unauthorized')

  const { error } = await supabase.from('search_keywords').insert({
    keyword: formData.get('keyword'),
    searches: parseInt(formData.get('searches') || 0),
    conversion_rate: parseFloat(formData.get('conversion') || 0),
    is_active: formData.get('status') === 'Active'
  })

  if (error) throw new Error(error.message)
  
  revalidatePath('/admin/keywords')
  return { success: true }
}