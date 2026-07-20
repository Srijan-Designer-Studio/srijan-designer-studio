'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createPublicClient } from '@supabase/supabase-js'

const publicSupabase = createPublicClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)




export async function getDashboardStats() {
  const supabase = await createClient()

  try {
    // 1. Total Orders
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })

    // 2. Total Customers 
    const { count: totalCustomers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    // 3. Recent Orders 
    const { data: recentOrders } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    // 4. Top Products
    const { data: topProducts } = await supabase
      .from('products')
      .select('*')
      .limit(10)


    return {
      totalRevenue: 0,
      totalOrders: totalOrders || 0,
      totalCustomers: totalCustomers || 0,
      recentOrders: recentOrders || [],
      topProducts: topProducts || [],


      keywords: [],
      salesData: [],
      revenueData: [],
      categoryData: []
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)


    return {
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      recentOrders: [],
      topProducts: [],
      keywords: [],
      salesData: [],
      revenueData: [],
      categoryData: []
    }
  }
}


export async function getAllOrders() {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('orders')

      .select('*, profiles(first_name, last_name, email)')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching all orders:', error)
    return []
  }
}


export async function updateOrderStatus(orderId, newStatus) {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Error updating order status:', error)
    return { success: false, error: error.message }
  }
}


export async function getAdminProducts() {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching admin products:', error)
    return []
  }
}




export async function updateProduct(productId, updates) {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)
      .select()
  
    if (error) throw error
    
    if (!data || data.length === 0) {
      return { success: false, error: "Product not found or permission denied" }
    }

    return { success: true, data: data[0] }
  } catch (error) {
    console.error('Error updating product:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteProduct(productId) {
  const supabase = await createClient()
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error deleting product:', error)
    return { success: false, error: error.message }
  }
}


export async function getAllCustomers() {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase
      .from('profiles') 
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching all customers:', error.message || error)
    return []
  }
}

export async function getCategories() {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function createCategory(categoryData) {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error(error)
    return { success: false, error: error.message }
  }
}

export async function updateCategory(categoryId, updates) {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', categoryId)
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error(error)
    return { success: false, error: error.message }
  }
}

export async function deleteCategory(categoryId) {
  const supabase = await createClient()
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: error.message }
  }
}

export async function createProduct(formData) {
  const supabase = await createClient()
  const imageFile = formData.get('image')
  let imageUrl = null

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(`images/${fileName}`, imageFile)

    if (uploadError) throw uploadError

    const { data: urlData } = supabase.storage
      .from('products')
      .getPublicUrl(`images/${fileName}`)
    
    imageUrl = urlData.publicUrl
  }

  const title = formData.get('title');
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  
  const productData = {
    title: title,
    slug: slug,
    base_price: parseFloat(formData.get('price') || 0),
    image_url: imageUrl,
    is_active: true,
    sku: formData.get('sku') || null,
    category_id: formData.get('category') || null, 
    stock_quantity: parseInt(formData.get('stock') || formData.get('stockQuantity') || 0, 10)
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error creating product:', error)
    return { success: false, error: error.message }
  }
}

export async function getUserOrders() {
  const supabase = await createClient()

  try {
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('User not authenticated')
      return []
    }

    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching user orders:', error.message || error)
    return []
  }
}