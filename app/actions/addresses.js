'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Get all addresses for the logged-in user
export async function getUserAddresses() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching addresses:', error)
    return []
  }

  return data
}

// Add a new address
export async function addAddress(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Authentication required')

  const isDefault = formData.get('isDefault') === 'true'

  if (isDefault) {
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id)
  }

  const { error } = await supabase
    .from('addresses')
    .insert({
      user_id: user.id,
      title: formData.get('title'),
      address_line_1: formData.get('addressLine1'),
      address_line_2: formData.get('addressLine2'),
      city: formData.get('city'),
      state: formData.get('state'),
      postal_code: formData.get('postalCode'),
      is_default: isDefault
    })

  if (error) throw new Error(error.message)

  revalidatePath('/account/addresses')
  revalidatePath('/checkout')
  return { success: true }
}

// Update an existing address
export async function updateAddress(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Authentication required')

  const addressId = formData.get('id')
  const isDefault = formData.get('isDefault') === 'true'

  if (!addressId) throw new Error('Address ID is required for updating.')

  if (isDefault) {
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id)
  }

  const { error } = await supabase
    .from('addresses')
    .update({
      title: formData.get('title'),
      address_line_1: formData.get('addressLine1'),
      address_line_2: formData.get('addressLine2'),
      city: formData.get('city'),
      state: formData.get('state'),
      postal_code: formData.get('postalCode'),
      is_default: isDefault
    })
    .eq('id', addressId)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/account/addresses')
  revalidatePath('/checkout')
  return { success: true }
}

// Delete an address
export async function deleteAddress(addressId) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Authentication required')

  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', addressId)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/account/addresses')
  revalidatePath('/checkout')
  return { success: true }
}