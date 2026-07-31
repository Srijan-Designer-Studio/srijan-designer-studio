'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

async function verifyAdmin(supabase) {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error("Unauthorized")
  if (user.user_metadata?.role !== 'admin') throw new Error("Forbidden: Admin access required")
  return user
}

export async function getAdminBlogs() {
  const supabase = createAdminClient()
  try {
    await verifyAdmin(supabase)
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    return []
  }
}

export async function createBlog(formData) {
  const supabase = createAdminClient()

  try {
    await verifyAdmin(supabase)

    const title = formData.get('title')
    const content = formData.get('content')
    const author = formData.get('author') || 'Admin'
    const category = formData.get('category') || 'Uncategorized'

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    const imageFile = formData.get('image')
    let imageUrl = null


    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, imageFile)

      if (uploadError) throw new Error("Failed to upload image")

      const { data: publicUrlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName)

      imageUrl = publicUrlData.publicUrl
    }

    // Insert into Database
    const { data, error } = await supabase
      .from('blogs')
      .insert({
        title,
        slug,
        content,
        author,
        category,
        image_url: imageUrl,
        is_published: true
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/blog')
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function deleteBlog(blogId) {
  const supabase = createAdminClient()
  try {
    await verifyAdmin(supabase)
    const { error } = await supabase.from('blogs').delete().eq('id', blogId)
    if (error) throw error
    revalidatePath('/blog')
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}