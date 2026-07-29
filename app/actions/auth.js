'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(formData) {
  const supabase = await createClient()
  const email = formData.get('email')
  const password = formData.get('password')

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  // Refresh the layout and redirect to the dashboard
  revalidatePath('/', 'layout')
  redirect('/account')
}

export async function register(formData) {
  const supabase = await createClient()
  const email = formData.get('email')
  const password = formData.get('password')
  const firstName = formData.get('firstName')
  const lastName = formData.get('lastName')

  // Supabase automatically triggers the handle_new_user() SQL function
  // to insert this metadata into your public.profiles table
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      }
    }
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/', 'layout')
  redirect('/account')
}

export async function logout() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function requestPasswordReset(formData) {
  const email = formData.get('email')
  const supabase = await createClient()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://srijan-ecommerce-three.vercel.app'

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/reset-password`,
  })

  if (error) throw new Error(error.message)
  return { success: true }
}

export async function resetPassword(formData) {
  const password = formData.get('password')
  const supabase = await createClient()

  // This relies on the secure session established by the emailed magic link
  const { error } = await supabase.auth.updateUser({ password })

  if (error) throw new Error(error.message)
  return { success: true }
}