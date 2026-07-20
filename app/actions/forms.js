'use server'

import { createClient } from '@/lib/supabase/server'

// SQL SCHEMA REQUIREMENTS (Run this in Supabase SQL Editor):
// CREATE TABLE public.contact_messages (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), name TEXT, email TEXT, phone TEXT, message TEXT, status TEXT DEFAULT 'new', created_at TIMESTAMPTZ DEFAULT NOW());
// CREATE TABLE public.custom_requests (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), name TEXT, phone TEXT, callback_date DATE, callback_time TIME, details TEXT, status TEXT DEFAULT 'pending', created_at TIMESTAMPTZ DEFAULT NOW());

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