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