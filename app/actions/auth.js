'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(formData) {
  const supabase = createAdminClient()
  const email = formData.get('email')
  const password = formData.get('password')

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')

  const isAdmin = data?.user?.email?.includes('admin') || data?.user?.user_metadata?.role === 'admin'

  return { success: true, redirectTo: isAdmin ? '/admin' : '/account' }
}

export async function loginWithGoogle() {
  const supabase = createAdminClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  if (data?.url) {
    redirect(data.url)
  }
}

export async function register(formData) {
  const supabase = createAdminClient()
  const email = formData.get('email')
  const password = formData.get('password')
  const firstName = formData.get('firstName')
  const lastName = formData.get('lastName')

  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          name: `${firstName} ${lastName}`,
          role: 'customer'
        }
      }
    })

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (err) {
    return { error: "Something went wrong during registration." }
  }
}

export async function logout() {
  const supabase = createAdminClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function requestPasswordReset(formData) {
  const email = formData.get('email')
  const supabase = createAdminClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://srijan-ecommerce-three.vercel.app'

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    // 404 Error এড়ানোর জন্য লিংকটি সরাসরি reset-password-এ পাঠানো হলো
    redirectTo: `${siteUrl}/reset-password`,
  })

  if (error) return { error: error.message }
  return { success: true }
}

export async function resetPassword(formData) {
  const password = formData.get('password')
  const supabase = createAdminClient()

  const { error } = await supabase.auth.updateUser({ password })

  if (error) return { error: error.message }
  return { success: true }
}
