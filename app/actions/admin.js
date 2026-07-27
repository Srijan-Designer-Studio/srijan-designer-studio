'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createPublicClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const publicSupabase = createPublicClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function verifyAdmin(supabase) {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error("Unauthorized")
  if (user.user_metadata?.role !== 'admin') throw new Error("Forbidden: Admin access required")
  return user
}

export async function getDashboardStats() {
  const supabase = await createClient()

  try {
    await verifyAdmin(supabase)

    const { data: orders } = await supabase
      .from('orders')
      .select('total_amount, status, created_at')

    let totalOrders = 0;
    let totalRevenue = 0;

    if (orders) {
      totalOrders = orders.length;
      orders.forEach(o => {
        if (o.status !== 'cancelled') {
          totalRevenue += Number(o.total_amount || 0);
        }
      });
    }

    const { count: totalCustomers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    const { data: recentOrders } = await supabase
      .from('orders')
      .select('id, total_amount, status, profiles(first_name, last_name)')
      .order('created_at', { ascending: false })
      .limit(5)

    const { data: topProductsData } = await supabase
      .from('products')
      .select('id, title, base_price, product_images(image_url)')
      .eq('is_active', true)
      .limit(4)

    const topProducts = topProductsData?.map(p => ({
      id: p.id,
      title: p.title,
      image: p.product_images?.[0]?.image_url || null,
      revenue: Number(p.base_price) * Math.floor(Math.random() * 10 + 1), 
      sales: Math.floor(Math.random() * 20 + 5)
    })) || [];

    const salesData = [
      { date: 'Mon', revenue: 12000, orders: 4 },
      { date: 'Tue', revenue: 19000, orders: 7 },
      { date: 'Wed', revenue: 15000, orders: 5 },
      { date: 'Thu', revenue: 22000, orders: 8 },
      { date: 'Fri', revenue: 28000, orders: 12 },
      { date: 'Sat', revenue: 35000, orders: 15 },
      { date: 'Sun', revenue: totalRevenue > 0 ? totalRevenue / 2 : 45000, orders: 18 },
    ];

    const revenueData = [
      { name: 'Online', value: 65, color: '#3b82f6' },
      { name: 'COD', value: 35, color: '#eab308' },
    ];

    const categoryData = [
      { name: 'Sarees', value: 45, color: '#8b5cf6' },
      { name: 'Lehengas', value: 25, color: '#ec4899' },
      { name: 'Kurtas', value: 20, color: '#14b8a6' },
      { name: 'Suits', value: 10, color: '#f59e0b' },
    ];

    const keywords = [
      { word: 'srijan fashion sarees', clicks: 245, impressions: '1.2k', ctr: '20.4%', position: 1.2 },
      { word: 'buy lehenga online', clicks: 182, impressions: '3.4k', ctr: '5.3%', position: 4.5 },
      { word: 'men ethnic wear', clicks: 145, impressions: '2.8k', ctr: '5.1%', position: 3.8 },
      { word: 'cotton kurti', clicks: 98, impressions: '4.1k', ctr: '2.3%', position: 8.4 },
    ];

    return {
      totalRevenue,
      totalOrders,
      totalCustomers: totalCustomers || 0,
      recentOrders: recentOrders || [],
      topProducts,
      salesData,
      revenueData,
      categoryData,
      keywords
    }
  } catch (error) {
    return {
      totalRevenue: 0, totalOrders: 0, totalCustomers: 0, recentOrders: [],
      topProducts: [], salesData: [], revenueData: [], categoryData: [], keywords: []
    };
  }
}

export async function getAllOrders() {
  const supabase = await createClient()

  try {
    await verifyAdmin(supabase)

    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        profiles (first_name, last_name),
        order_items (
          variant_id,
          quantity,
          price
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    if (!orders || orders.length === 0) return []

    const itemIds = [...new Set(orders.flatMap(o => o.order_items?.map(i => i.variant_id).filter(Boolean)))];

    let products = [];
    let variants = [];

    if (itemIds.length > 0) {
      const { data: pData } = await supabase.from('products').select('id, title').in('id', itemIds);
      products = pData || [];
      
      const { data: vData } = await supabase.from('product_variants').select('id, sku, products(title)').in('id', itemIds);
      variants = vData || [];
    }

    const formattedOrders = orders.map(order => ({
      ...order,
      order_items: order.order_items ? order.order_items.map(item => {
        const variantMatch = variants.find(v => v.id === item.variant_id);
        const productMatch = products.find(p => p.id === item.variant_id);
        
        return {
          ...item,
          product_variants: {
            sku: variantMatch?.sku || 'N/A',
            products: {
              title: variantMatch?.products?.title || productMatch?.title || 'Unknown Product'
            }
          }
        };
      }) : []
    }));

    return formattedOrders
  } catch (error) {
    return []
  }
}

export async function updateOrderStatus(orderId, newStatus) {
  const supabase = await createClient()

  try {
    await verifyAdmin(supabase)

    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function getAdminProducts() {
  const supabase = await createClient()
  try {
    await verifyAdmin(supabase)

    const { data, error } = await supabase
      .from('products')
      .select('*, product_variants(*), product_images(*), categories(*)')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    return []
  }
}

export async function deleteProduct(productId) {
  const supabase = await createClient()
  try {
    await verifyAdmin(supabase)

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)

    if (error) throw error
    revalidatePath('/admin/product')
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function getAllCustomers() {
  const supabase = await createClient()
  
  try {
    await verifyAdmin(supabase)

    const { data, error } = await supabase
      .from('profiles') 
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    return []
  }
}

export async function getCategories() {
  try {
    const { data, error } = await publicSupabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    return []
  }
}

export async function createCategory(formData) {
  const supabase = await createClient()
  try {
    await verifyAdmin(supabase)

    const name = formData.get('name');
    const slug = formData.get('slug');
    const image_url = formData.get('image_url');

    const { data, error } = await supabase
      .from('categories')
      .insert([{ name, slug, image_url }])
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function updateCategory(categoryId, formData) {
  const supabase = await createClient()
  try {
    await verifyAdmin(supabase)

    const name = formData.get('name');
    const slug = formData.get('slug');
    const image_url = formData.get('image_url');

    const updates = { name, slug };
    
    if (image_url) {
      updates.image_url = image_url;
    }

    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', categoryId)
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function deleteCategory(categoryId) {
  const supabase = await createClient()
  try {
    await verifyAdmin(supabase)

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function getUserOrders() {
  const supabase = await createClient()

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) return []

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    return []
  }
}

export async function updateProduct(productId, formData) {
  const supabase = await createClient()
  const imageFile = formData.get('image')
  let imageUrl = null

  try {
    await verifyAdmin(supabase)

    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)

      imageUrl = urlData.publicUrl
    }

    const title = formData.get('title')
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    const { data: productData, error: productError } = await supabase
      .from('products')
      .update({
        title: title,
        slug: slug,
        base_price: parseFloat(formData.get('price') || 0),
        category_id: formData.get('category') || null,
        product_type: formData.get('type') || null
      })
      .eq('id', productId)
      .select()

    if (productError) throw productError

    if (!productData || productData.length === 0) {
      return { success: false, error: "Product not found" }
    }

    const { data: variantData } = await supabase
      .from('product_variants')
      .select('id')
      .eq('product_id', productId)
      .limit(1)

    if (variantData && variantData.length > 0) {
      const { error: variantError } = await supabase
        .from('product_variants')
        .update({
          sku: formData.get('sku') || null,
          size: formData.get('size') || 'Free Size',
          inventory_count: parseInt(formData.get('stock') || formData.get('stockQuantity') || 0, 10)
        })
        .eq('id', variantData[0].id)

      if (variantError) throw variantError
    }

    if (imageUrl) {
      const { data: imageData } = await supabase
        .from('product_images')
        .select('id')
        .eq('product_id', productId)
        .limit(1)

      if (imageData && imageData.length > 0) {
        await supabase
          .from('product_images')
          .update({ image_url: imageUrl })
          .eq('id', imageData[0].id)
      } else {
        await supabase
          .from('product_images')
          .insert({
            product_id: productId,
            image_url: imageUrl,
            is_primary: true
          })
      }
    }

    revalidatePath('/admin/product')
    return { success: true, data: productData[0] }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function createProduct(formData) {
  const supabase = await createClient()
  const imageFile = formData.get('image')
  let imageUrl = null

  try {
    await verifyAdmin(supabase)

    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)
      
      imageUrl = urlData.publicUrl
    }

    const title = formData.get('title')
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    const { data: newProduct, error: productError } = await supabase
      .from('products')
      .insert({
        title: title,
        slug: slug,
        base_price: parseFloat(formData.get('price') || 0),
        category_id: formData.get('category') || null, 
        product_type: formData.get('type') || null,
        is_active: true
      })
      .select()
      .single()

    if (productError) throw productError

    const { error: variantError } = await supabase
      .from('product_variants')
      .insert({
        product_id: newProduct.id,
        sku: formData.get('sku') || null,
        size: formData.get('size') || 'Free Size',
        inventory_count: parseInt(formData.get('stock') || formData.get('stockQuantity') || 0, 10)
      })

    if (variantError) throw variantError

    if (imageUrl) {
      const { error: imageError } = await supabase
        .from('product_images')
        .insert({
          product_id: newProduct.id,
          image_url: imageUrl,
          is_primary: true
        })

      if (imageError) throw imageError
    }

    revalidatePath('/admin/product')
    return { success: true, data: newProduct }
  } catch (error) {
    return { success: false, error: error.message }
  }
}