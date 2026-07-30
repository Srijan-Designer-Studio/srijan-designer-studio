'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getAllBlogs() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('blogs')
    .select('*, categories(name)')
    .order('created_at', { ascending: false })

  if (error) return []
  return data
}

export async function getBlogCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('categories').select('*')
  if (error) return []
  return data
}

export async function createBlog(formData) {
  const supabase = await createClient()

  const title = formData.get("title");
  const content = formData.get("content");
  const metaTitle = formData.get("metaTitle");
  const metaDescription = formData.get("metaDescription");
  const keywords = formData.get("keywords");
  const permalink = formData.get("permalink");
  const category_id = formData.get("category");
  const image = formData.get("image");

  let image_url = null;

  if (image && image.size > 0) {
    const fileExt = image.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(fileName, image);

    if (uploadError) {
      throw new Error("Image upload failed: " + uploadError.message);
    }

    const { data: publicUrlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(fileName);
      
    image_url = publicUrlData.publicUrl;
  }

  const { error } = await supabase.from('blogs').insert({
    title,
    content,
    slug: permalink,
    meta_title: metaTitle,
    meta_description: metaDescription,
    keywords,
    category_id: category_id || null,
    image_url
  });

  if (error) throw new Error(error.message);

  revalidatePath('/admin/blogs')
  revalidatePath('/blogs')
  
  return { success: true };
}

export async function getBlogBySlug(slug) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('blogs')
    .select('*, categories(name)')
    .eq('slug', slug)
    .single()

  if (error) return null
  return data
}

export async function deleteBlogById(id) {
  const supabase = await createClient()
  
  const { error } = await supabase.from('blogs').delete().eq('id', id)
  
  if (error) throw new Error(error.message)
  
  revalidatePath('/admin/blogs')
  revalidatePath('/blogs')
  
  return { success: true }
}

export async function getBlogById(id) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function updateBlog(id, formData) {
  const supabase = await createClient()

  const title = formData.get("title");
  const content = formData.get("content");
  const metaTitle = formData.get("metaTitle");
  const metaDescription = formData.get("metaDescription");
  const keywords = formData.get("keywords");
  const permalink = formData.get("permalink");
  const category_id = formData.get("category");
  const image = formData.get("image");
  const existing_image = formData.get("existing_image");

  let image_url = existing_image;

  if (image && image.size > 0) {
    const fileExt = image.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(fileName, image);

    if (uploadError) {
      throw new Error("Image upload failed: " + uploadError.message);
    }

    const { data: publicUrlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(fileName);
      
    image_url = publicUrlData.publicUrl;
  }

  const { error } = await supabase.from('blogs').update({
    title,
    content,
    slug: permalink,
    meta_title: metaTitle,
    meta_description: metaDescription,
    keywords,
    category_id: category_id || null,
    image_url
  }).eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/blogs')
  revalidatePath('/blogs')
  revalidatePath(`/blog/${permalink}`)
  
  return { success: true };
}

// CKEditor-এর ভেতর থেকে ছবি আপলোড করার ফাংশন
export async function uploadImageForEditor(formData) {
  const supabase = await createClient()
  const image = formData.get("image");

  if (!image || image.size === 0) {
    throw new Error("No image found");
  }

  const fileExt = image.name.split('.').pop();
  const fileName = `editor_${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('blog-images')
    .upload(fileName, image);

  if (uploadError) {
    throw new Error("Image upload failed: " + uploadError.message);
  }

  const { data: publicUrlData } = supabase.storage
    .from('blog-images')
    .getPublicUrl(fileName);

  return { url: publicUrlData.publicUrl };
}