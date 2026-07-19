'use server'

import { createClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid' // Make sure to: npm install uuid

export async function uploadProductImage(formData) {
  const supabase = await createClient()
  
  // Security Check: Verify Admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.user_metadata?.role !== 'admin') {
    throw new Error('Unauthorized upload attempt.')
  }

  const file = formData.get('image') // File object from input type="file"
  if (!file) throw new Error('No file provided.')

  // Generate safe filename to prevent overwriting
  const fileExt = file.name.split('.').pop()
  const fileName = `${uuidv4()}.${fileExt}`
  const filePath = `products/${fileName}`

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (uploadError) throw new Error(uploadError.message)

  // Get Public URL
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath)

  return { success: true, url: publicUrl }
}

export async function deleteProductImage(imageUrl) {
  const supabase = await createClient()
  
  // Security Check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.user_metadata?.role !== 'admin') throw new Error('Unauthorized.')

  // Extract path from public URL
  const path = imageUrl.split('/product-images/')[1]
  if (!path) throw new Error('Invalid image URL')

  const { error } = await supabase.storage
    .from('product-images')
    .remove([path])

  if (error) throw new Error(error.message)
  return { success: true }
}