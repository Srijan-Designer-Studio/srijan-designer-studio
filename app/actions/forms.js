'use server'

import { createClient } from '@/lib/supabase/server'


export async function submitContactMessage(formData) {
  const supabase = await createClient()

  const { error } = await supabase.from('contact_messages').insert({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    message: formData.get('message')
  })

  if (error) throw new Error(error.message)
  return { success: true }
}

export async function submitCustomRequest(formData) {
  const supabase = await createClient()

  const { error } = await supabase.from('custom_requests').insert({
    name: formData.get('name'),
    phone: formData.get('phone'),
    callback_date: formData.get('callDate'),
    callback_time: formData.get('callTime'),
    details: formData.get('details')
  })

  if (error) throw new Error(error.message)
  return { success: true }
}