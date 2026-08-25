'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function getKeywords() {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('search_keywords')
    .select('*')
    .order('searches', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }
  
  return data || []
}

export async function addKeyword(formData) {
  const supabase = createAdminClient()
  
  const keyword = formData.get("keyword")
  const searches = parseInt(formData.get("searches") || "0", 10)
  const conversion_rate = parseFloat(formData.get("conversion") || "0")
  const status = formData.get("status")
  const is_active = status === "Active"

  const { error } = await supabase
    .from('search_keywords')
    .insert({
      keyword,
      searches,
      conversion_rate,
      is_active
    })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/keywords')
  return { success: true }
}

export async function updateKeyword(id, formData) {
  const supabase = createAdminClient()
  
  const keyword = formData.get("keyword")
  const searches = parseInt(formData.get("searches") || "0", 10)
  const conversion_rate = parseFloat(formData.get("conversion") || "0")
  const status = formData.get("status")
  const is_active = status === "Active"

  const { error } = await supabase
    .from('search_keywords')
    .update({
      keyword,
      searches,
      conversion_rate,
      is_active
    })
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/keywords')
  return { success: true }
}

export async function deleteKeyword(id) {
  const supabase = createAdminClient()
  
  const { error } = await supabase
    .from('search_keywords')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/keywords')
  return { success: true }
}