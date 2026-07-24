'use server'

import { createClient } from '@/lib/supabase/server'


export async function getBlogs() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blogs')
    .select('id, title, slug, image_url, created_at')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching blogs:", error)
    return []
  }
  return data
}

export async function getBlogBySlug(slug) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) return null
  return data
}