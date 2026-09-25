'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function getPolicy(slug) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('policies')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) return null
  return data
}

export async function getAllPolicies() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('policies')
    .select('*')
    .order('title', { ascending: true })

  if (error) return []
  return data
}

export async function updatePolicy(formData) {
  const adminDb = createAdminClient()
  const slug = formData.get('slug')
  const title = formData.get('title')
  const content = formData.get('content')

  const { error } = await adminDb
    .from('policies')
    .upsert({ slug, title, content, updated_at: new Date().toISOString() }, { onConflict: 'slug' })

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/policies')
  revalidatePath(`/policies/${slug}`) 
  revalidatePath(`/${slug}`) 
  return { success: true }
}