'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { unstable_noStore as noStore } from 'next/cache'

export async function getAllBlogs() {
  noStore()
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('blogs').select('*, categories(name)').order('published_at', { ascending: false })
  if (error) return []
  return data
}

export async function getBlogCategories() {
  noStore()
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('categories').select('*')
  if (error) return []
  return data
}

export async function createBlog(formData) {
  const supabase = createAdminClient()
  const title = formData.get("title");
  const content = formData.get("content");
  const metaTitle = formData.get("metaTitle");
  const metaDescription = formData.get("metaDescription");
  const keywords = formData.get("keywords");
  const permalink = formData.get("permalink");
  const image = formData.get("image");
  const author = formData.get("author") || "Admin";
  
  const cover_img_alt = formData.get("cover_img_alt") || null;
  const canonical_tag = formData.get("canonical_tag") || null;
  const schema_markup = formData.get("schema_markup") || null;

  let cat_id = formData.get("category");
  if (!cat_id || cat_id === "null" || cat_id === "undefined" || cat_id === "") {
    cat_id = null;
  }

  let published_at = formData.get("published_at");
  published_at = published_at ? new Date(published_at).toISOString() : new Date().toISOString();

  let image_url = null;
  if (image && image.size > 0) {
    const fileExt = image.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('blog-images').upload(fileName, image);
    if (uploadError) throw new Error("Image upload failed: " + uploadError.message);
    const { data: publicUrlData } = supabase.storage.from('blog-images').getPublicUrl(fileName);
    image_url = publicUrlData.publicUrl;
  }

  const { error } = await supabase.from('blogs').insert({
    title, content, slug: permalink, meta_title: metaTitle, meta_description: metaDescription,
    keywords, category_id: cat_id, image_url, author, published_at,
    cover_img_alt, canonical_tag, schema_markup
  });

  if (error) throw new Error(error.message);
  revalidatePath('/admin/blogs')
  revalidatePath('/blogs')
  return { success: true };
}

export async function getBlogBySlug(slug) {
  noStore()
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('blogs').select('*, categories(name)').eq('slug', slug).single()
  if (error) return null
  return data
}

export async function deleteBlogById(id) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('blogs').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/blogs')
  revalidatePath('/blogs')
  return { success: true }
}

export async function getBlogById(id) {
  noStore()
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('blogs').select('*').eq('id', id).single()
  if (error) return null
  return data
}

export async function updateBlog(id, formData) {
  try {
    const supabase = createAdminClient();
    
    const targetId = id || formData.get("blog_id");
    if (!targetId) throw new Error("Blog ID is missing!");

    const updateData = {
      title: formData.get("title") || "",
      content: formData.get("content") || "",
      slug: formData.get("permalink") || "",
      meta_title: formData.get("metaTitle") || "",
      meta_description: formData.get("metaDescription") || "",
      keywords: formData.get("keywords") || "",
      author: formData.get("author") || "Admin",
      cover_img_alt: formData.get("cover_img_alt") || null,
      canonical_tag: formData.get("canonical_tag") || null,
      schema_markup: formData.get("schema_markup") || null
    };

    const cat_id = formData.get("category");
    updateData.category_id = (cat_id && cat_id !== "null" && cat_id !== "") ? cat_id : null;

    const published_at = formData.get("published_at");
    if (published_at && published_at !== "null" && published_at !== "") {
      updateData.published_at = new Date(published_at).toISOString();
    }

    const image = formData.get("image");
    if (image && image.size > 0) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('blog-images').upload(fileName, image);
      if (uploadError) throw new Error("Image upload failed");
      const { data: publicUrlData } = supabase.storage.from('blog-images').getPublicUrl(fileName);
      updateData.image_url = publicUrlData.publicUrl;
    } else {
      const existing_image = formData.get("existing_image");
      if (existing_image && existing_image !== "null") {
        updateData.image_url = existing_image;
      }
    }

    const { data, error } = await supabase.from('blogs').update(updateData).eq('id', targetId).select();
    
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error("Could not find the blog in the database.");

    revalidatePath('/admin/blogs')
    revalidatePath('/blogs')
    revalidatePath(`/blog/${updateData.slug}`)
    
    return { success: true };
  } catch (error) {
    return { error: error.message }; 
  }
}

export async function uploadImageForEditor(formData) {
  const supabase = createAdminClient()
  const image = formData.get("image");
  if (!image || image.size === 0) throw new Error("No image found");
  const fileExt = image.name.split('.').pop();
  const fileName = `editor_${Date.now()}.${fileExt}`;
  const { error: uploadError } = await supabase.storage.from('blog-images').upload(fileName, image);
  if (uploadError) throw new Error("Image upload failed: " + uploadError.message);
  const { data: publicUrlData } = supabase.storage.from('blog-images').getPublicUrl(fileName);
  return { url: publicUrlData.publicUrl };
}