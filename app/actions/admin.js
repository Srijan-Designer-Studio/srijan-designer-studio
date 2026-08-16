'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import nodemailer from 'nodemailer'
import {
  scheduleShiprocketPickup,
  getShiprocketLabel,
  getShiprocketInvoice,
  cancelShiprocketOrder,
  createShiprocketReturn,
  takeNDRAction,
  checkServiceability,
  createShiprocketOrder,
  generateAWB,
  trackShiprocketOrder
} from '@/lib/utils/shiprocket'

async function verifyAdmin() {
  return true;
}

export async function getDashboardStats() {
  const supabase = createAdminClient()

  try {
    await verifyAdmin()

    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, total_amount, status, created_at, payment_method, user_id')

    if (ordersError) console.error(ordersError.message)

    let totalOrders = 0;
    let totalRevenue = 0;

   if (orders) {
      totalOrders = orders.length;
      orders.forEach(o => {        
        if (o.status === 'delivered') {
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

    const salesData = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

      const dayOrders = orders?.filter(o => o.created_at.startsWith(dateString)) || [];
      const dayRev = dayOrders.reduce((sum, o) => o.status !== 'cancelled' ? sum + Number(o.total_amount || 0) : sum, 0);

      salesData.push({ date: dayName, revenue: dayRev, orders: dayOrders.length });
    }

    let onlineRev = 0;
    let codRev = 0;
    orders?.forEach(o => {
      if (o.status !== 'cancelled') {
        if (o.payment_method?.toUpperCase() === 'COD') {
          codRev += Number(o.total_amount || 0);
        } else {
          onlineRev += Number(o.total_amount || 0);
        }
      }
    });

    const totalForPie = onlineRev + codRev;
    const onlinePct = totalForPie > 0 ? Math.round((onlineRev / totalForPie) * 100) : 0;
    const codPct = totalForPie > 0 ? Math.round((codRev / totalForPie) * 100) : 0;

    const revenueData = [
      { name: 'Online', value: onlinePct || 0, color: '#3b82f6' },
      { name: 'COD', value: codPct || 0, color: '#eab308' },
    ];

    const { data: orderItems } = await supabase
      .from('order_items')
      .select(`
        quantity,
        price,
        product_variants (
          products ( department, product_type )
        )
      `);

    const categoryMap = {};
    orderItems?.forEach(item => {
      const catName = item.product_variants?.products?.department || item.product_variants?.products?.product_type || 'Others';
      const itemTotal = Number(item.price || 0) * Number(item.quantity || 1);
      categoryMap[catName] = (categoryMap[catName] || 0) + itemTotal;
    });

    const totalCatRev = Object.values(categoryMap).reduce((a, b) => a + b, 0);
    const catColors = ['#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444'];
    
    let categoryData = Object.keys(categoryMap).map((key, index) => ({
      name: key,
      value: totalCatRev > 0 ? Math.round((categoryMap[key] / totalCatRev) * 100) : 0,
      color: catColors[index % catColors.length]
    })).sort((a, b) => b.value - a.value).slice(0, 4); 

    if (categoryData.length === 0) {
      categoryData = [{ name: 'No Sales Yet', value: 100, color: '#e5e7eb' }];
    }

    const topProducts = [];
 
    const { data: topProductsData } = await supabase
      .from('products')
      .select('id, title, base_price, product_images(image_url)')
      .eq('is_active', true)
      .limit(4)

    if (topProductsData) {
      topProductsData.forEach(p => {
        topProducts.push({
          id: p.id,
          title: p.title,
          image: p.product_images?.[0]?.image_url || null,
          revenue: Number(p.base_price || 0),
          sales: 1
        });
      });
    }

    const keywords = [
      { word: 'srijan fashion', clicks: 245, impressions: '1.2k', ctr: '20.4%', position: 1.2 },
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
    console.error("Dashboard Stats Error:", error);
    return {
      totalRevenue: 0, totalOrders: 0, totalCustomers: 0, recentOrders: [],
      topProducts: [], salesData: [], revenueData: [], categoryData: [], keywords: []
    };
  }
}

export async function getAllOrders() {
  const supabase = createAdminClient()

  try {
    await verifyAdmin()

    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          variant_id,
          quantity,
          price
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    if (!orders || orders.length === 0) return []

    const userIds = [...new Set(orders.map(o => o.user_id).filter(Boolean))];
    let profilesMap = {};

    if (userIds.length > 0) {
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .in('id', userIds);

      if (profilesData) {
        profilesMap = Object.fromEntries(profilesData.map(p => [p.id, p]));
      }
    }

    const itemIds = [...new Set(orders.flatMap(o => o.order_items?.map(i => i.variant_id).filter(Boolean)))];

    let products = [];
    let variants = [];

    if (itemIds.length > 0) {
      const { data: pData } = await supabase.from('products').select('id, title, product_images(image_url)').in('id', itemIds);
      products = pData || [];

      const { data: vData } = await supabase.from('product_variants').select('id, sku, products(title, product_images(image_url))').in('id', itemIds);
      variants = vData || [];
    }

    const formattedOrders = orders.map(order => ({
      ...order,
      profiles: profilesMap[order.user_id] || { first_name: 'Guest', last_name: 'User', email: 'N/A' },
      order_items: order.order_items ? order.order_items.map(item => {
        const variantMatch = variants.find(v => v.id === item.variant_id);
        const productMatch = products.find(p => p.id === item.variant_id);

        return {
          ...item,
          product_variants: {
            sku: variantMatch?.sku || 'N/A',
            products: {
              title: variantMatch?.products?.title || productMatch?.title || 'Unknown Product',
              product_images: variantMatch?.products?.product_images || productMatch?.product_images || []
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
  const supabase = createAdminClient()

  try {
    await verifyAdmin()

    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (updateError) throw updateError

    const { data: orderData, error: fetchError } = await supabase
      .from('orders')
      .select(`
        id,
        status,
        total_amount,
        user_id
      `)
      .eq('id', orderId)
      .single();

    let customerEmail = null;
    let customerName = 'Customer';

    if (!fetchError && orderData?.user_id) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, last_name, email')
        .eq('id', orderData.user_id)
        .single();

      if (profileData) {
        customerEmail = profileData.email;
        customerName = profileData.first_name || 'Customer';
      }
    }

    if (customerEmail) {
      const displayOrderId = orderData.id.split('-')[0].toUpperCase();

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      let subject = '';
      let messageHtml = '';

      if (newStatus === 'processing') {
        subject = `Order Accepted - #${displayOrderId} | SRIJAN Fashion`;
        messageHtml = `<p>Hi ${customerName},</p><p>Great news! Your order <strong>#${displayOrderId}</strong> has been accepted and is now being processed. We will notify you once it is shipped.</p>`;
      } else if (newStatus === 'shipped') {
        subject = `Order Shipped - #${displayOrderId} | SRIJAN Fashion`;
        messageHtml = `<p>Hi ${customerName},</p><p>Your order <strong>#${displayOrderId}</strong> has been shipped and is on its way to you!</p>`;
      } else if (newStatus === 'delivered') {
        subject = `Order Delivered - #${displayOrderId} | SRIJAN Fashion`;
        messageHtml = `<p>Hi ${customerName},</p><p>Your order <strong>#${displayOrderId}</strong> has been delivered successfully. Thank you for shopping with SRIJAN Fashion!</p>`;
      } else if (newStatus === 'cancelled') {
        subject = `Order Cancelled - #${displayOrderId} | SRIJAN Fashion`;
        messageHtml = `<p>Hi ${customerName},</p><p>Your order <strong>#${displayOrderId}</strong> has been cancelled. If you have already paid, your refund will be initiated soon.</p>`;
      } else if (newStatus === 'returned') {
        subject = `Order Returned - #${displayOrderId} | SRIJAN Fashion`;
        messageHtml = `<p>Hi ${customerName},</p><p>Your return request for order <strong>#${displayOrderId}</strong> has been processed successfully.</p>`;
      }

      if (subject !== '') {
        const mailOptions = {
          from: `"SRIJAN Fashion" <${process.env.SMTP_USER}>`,
          to: customerEmail,
          subject: subject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
              <h2 style="color: #0ba6ff; border-bottom: 2px solid #0ba6ff; padding-bottom: 10px; margin-top: 0;">SRIJAN Fashion</h2>
              <div style="color: #4a5568; font-size: 16px; margin-top: 20px; line-height: 1.6;">
                ${messageHtml}
                <p style="margin-top: 20px; font-weight: bold;">Order Amount: ₹${Number(orderData.total_amount).toLocaleString('en-IN')}</p>
              </div>
              <p style="color: #718096; font-size: 12px; margin-top: 30px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
                This is an automated email, please do not reply. For support, visit our website.
              </p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
      }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function getAdminProducts() {
  const supabase = createAdminClient()
  try {
    await verifyAdmin()
    const { data, error } = await supabase
      .from('products')
      .select('*, product_variants(*), product_images(*)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Products Fetch Error:", error.message);
      throw error;
    }
    return data || []
  } catch (error) {
    console.error("Critical Products Error:", error.message);
    return []
  }
}

export async function deleteProduct(productId) {
  const supabase = createAdminClient()
  try {
    await verifyAdmin()
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)

    if (error) throw error
    revalidatePath('/admin/products')
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function getAllCustomers() {
  const supabase = createAdminClient()
  try {
    await verifyAdmin()
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
  const supabase = createAdminClient()
  try {
    const { data, error } = await supabase
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
  const supabase = createAdminClient()
  try {
    await verifyAdmin()

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
  const supabase = createAdminClient()
  try {
    await verifyAdmin()

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
  const supabase = createAdminClient()
  try {
    await verifyAdmin()

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
  const supabase = createAdminClient()

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

async function generateUniqueSlug(supabase, baseSlug) {
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const { data } = await supabase.from('products').select('id').eq('slug', slug).maybeSingle();
    if (!data) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
}

export async function updateProduct(productId, formData) {
  const supabase = createAdminClient()
  try {
    await verifyAdmin()

    const title = formData.get('title') || ''
    const short_description = formData.get('shortDesc') || null
    const full_description = formData.get('fullDesc') || null
    const brand = formData.get('brand') || 'Srijan'
    const product_type = formData.get('productType') || null
    const department = formData.get('department') || null
    const purchase_type = formData.get('purchaseType') || 'Single Product'
    const status = formData.get('status') || 'Draft'

    const seo_title = formData.get('seoTitle') || null
    let seo_slug = formData.get('seoSlug') || null
    if (!seo_slug) {
      seo_slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    }
    seo_slug = await generateUniqueSlug(supabase, seo_slug);

    const meta_desc = formData.get('metaDesc') || null
    const focus_keyword = formData.get('focusKeyword') || null
    const seo_keywords = formData.get('seoKeywords') || null

    let basePrice = 0;
    const variantsStr = formData.get('variants')
    if (variantsStr) {
      const variants = JSON.parse(variantsStr)
      if (variants.length > 0) {
        basePrice = parseFloat(variants[0].price || 0)
      }
    }

    const { data: productData, error: productError } = await supabase
      .from('products')
      .update({
        title,
        slug: seo_slug,
        base_price: basePrice,
        short_description, full_description, brand, product_type, department, purchase_type,
        seo_title, seo_slug, meta_desc, focus_keyword, seo_keywords, status, is_active: status === 'Published'
      })
      .eq('id', productId)
      .select()

    if (productError) throw productError
    if (!productData || productData.length === 0) {
      return { success: false, error: "Product not found" }
    }

    if (variantsStr) {
      await supabase.from('product_variants').delete().eq('product_id', productId)
      const variants = JSON.parse(variantsStr)
      const variantData = variants.map(v => ({
        product_id: productId,
        sku: v.sku || `SKU-${Date.now()}`,
        size: v.size || 'Free Size',
        price: parseFloat(v.price || 0),
        sale_price: v.salePrice ? parseFloat(v.salePrice) : null,
        inventory_count: parseInt(v.stock || 0, 10),
        weight: parseFloat(v.weight || 0)
      }))
      const { error: variantError } = await supabase.from('product_variants').insert(variantData)
      if (variantError) throw variantError
    }

    const componentsStr = formData.get('components')
    if (componentsStr && purchase_type !== 'Single Product') {
      await supabase.from('product_components').delete().eq('product_id', productId)
      const components = JSON.parse(componentsStr)
      const componentData = components.map(c => ({
        product_id: productId,
        name: c.name,
        is_required: c.required,
        price: parseFloat(c.price || 0)
      }))
      const { error: compError } = await supabase.from('product_components').insert(componentData)
      if (compError) throw compError
    }

    const imageFiles = []
    for (let [key, value] of formData.entries()) {
      if (key.startsWith('image_') && value instanceof File && value.size > 0) {
        imageFiles.push(value)
      }
    }

    if (imageFiles.length > 0) {
      await supabase.from('product_images').delete().eq('product_id', productId)
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file)
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName)
          await supabase.from('product_images').insert({
            product_id: productId,
            image_url: urlData.publicUrl,
            is_primary: i === 0
          })
        }
      }
    }

    revalidatePath('/admin/products')
    return { success: true, data: productData[0] }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function createProduct(formData) {
  const supabase = createAdminClient()
  try {
    await verifyAdmin()

    const title = formData.get('title') || ''
    const short_description = formData.get('shortDesc') || null
    const full_description = formData.get('fullDesc') || null
    const brand = formData.get('brand') || 'Srijan'
    const product_type = formData.get('productType') || null
    const department = formData.get('department') || null
    const purchase_type = formData.get('purchaseType') || 'Single Product'
    const status = formData.get('status') || 'Draft'

    const seo_title = formData.get('seoTitle') || null
    let seo_slug = formData.get('seoSlug') || null
    if (!seo_slug) {
      seo_slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    }
    seo_slug = await generateUniqueSlug(supabase, seo_slug);

    const meta_desc = formData.get('metaDesc') || null
    const focus_keyword = formData.get('focusKeyword') || null
    const seo_keywords = formData.get('seoKeywords') || null

    let basePrice = 0;
    const variantsStr = formData.get('variants')
    if (variantsStr) {
      const variants = JSON.parse(variantsStr)
      if (variants.length > 0) {
        basePrice = parseFloat(variants[0].price || 0)
      }
    }

    const { data: newProduct, error: productError } = await supabase
      .from('products')
      .insert({
        title,
        slug: seo_slug,
        base_price: basePrice,
        short_description, full_description, brand, product_type, department, purchase_type,
        seo_title, seo_slug, meta_desc, focus_keyword, seo_keywords, status, is_active: status === 'Published'
      })
      .select()
      .single()

    if (productError) throw productError
    const productId = newProduct.id

    if (variantsStr) {
      const variants = JSON.parse(variantsStr)
      const variantData = variants.map(v => ({
        product_id: productId,
        sku: v.sku || `SKU-${Date.now()}`,
        size: v.size || 'Free Size',
        price: parseFloat(v.price || 0),
        sale_price: v.salePrice ? parseFloat(v.salePrice) : null,
        inventory_count: parseInt(v.stock || 0, 10),
        weight: parseFloat(v.weight || 0)
      }))
      const { error: variantError } = await supabase.from('product_variants').insert(variantData)
      if (variantError) throw variantError
    }

    const componentsStr = formData.get('components')
    if (componentsStr && purchase_type !== 'Single Product') {
      const components = JSON.parse(componentsStr)
      const componentData = components.map(c => ({
        product_id: productId,
        name: c.name,
        is_required: c.required,
        price: parseFloat(c.price || 0)
      }))
      const { error: compError } = await supabase.from('product_components').insert(componentData)
      if (compError) throw compError
    }

    const imageFiles = []
    for (let [key, value] of formData.entries()) {
      if (key.startsWith('image_') && value instanceof File && value.size > 0) {
        imageFiles.push(value)
      }
    }

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file)
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName)
        await supabase.from('product_images').insert({
          product_id: productId,
          image_url: urlData.publicUrl,
          is_primary: i === 0
        })
      }
    }

    revalidatePath('/admin/products')
    return { success: true, data: newProduct }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function pushOrderToShiprocket(orderId) {
  const supabase = createAdminClient();

  try {
    const { data: order, error } = await supabase
      .from("orders")
      .select("*, order_items(*), profiles(first_name, last_name, email)")
      .eq("id", orderId)
      .single();

    if (error) throw error;

    const pickupPincode = "741404";
    const deliveryPincode = order.shipping_address_pincode || "110001";
    const weight = 0.5;
    const isCOD = order.payment_method === "COD" ? 1 : 0;

    const serviceability = await checkServiceability(pickupPincode, deliveryPincode, weight, isCOD);

    if (serviceability.status !== 200 || !serviceability.data?.available_courier_companies?.length) {
      console.warn("Serviceability issue or no couriers found, but proceeding to create order.");
    }

    const shiprocketOrderData = {
      order_id: order.id,
      order_date: new Date(order.created_at).toISOString().split('T')[0],
      pickup_location: "Primary",
      billing_customer_name: order.profiles?.first_name || "Customer",
      billing_last_name: order.profiles?.last_name || "",
      billing_address: order.shipping_address || "No Address Provided",
      billing_city: order.shipping_city || "Santipur",
      billing_pincode: deliveryPincode,
      billing_state: order.shipping_state || "West Bengal",
      billing_country: "India",
      billing_email: order.profiles?.email || "noemail@example.com",
      billing_phone: order.customer_phone || "0000000000",
      shipping_is_billing: true,
      order_items: order.order_items.map((item) => ({
        name: "Product Variant " + item.variant_id,
        sku: "SKU-" + item.variant_id,
        units: item.quantity,
        selling_price: item.price,
      })),
      payment_method: order.payment_method === "COD" ? "COD" : "Prepaid",
      sub_total: order.total_amount,
      length: 10,
      breadth: 10,
      height: 10,
      weight: weight,
    };

    const shiprocketResponse = await createShiprocketOrder(shiprocketOrderData);

    if (shiprocketResponse.status_code === 1 || shiprocketResponse.order_id) {
      const shipmentId = shiprocketResponse.shipment_id;

      const awbResponse = await generateAWB(shipmentId);
      const awbCode = awbResponse.response?.data?.awb_code || null;

      await supabase
        .from("orders")
        .update({
          status: "processing",
          shiprocket_order_id: shiprocketResponse.order_id,
          shiprocket_shipment_id: shipmentId,
          tracking_number: awbCode
        })
        .eq("id", orderId);

      return { success: true, data: { order: shiprocketResponse, awb: awbResponse } };
    } else {
      throw new Error(shiprocketResponse.message || "Failed to create order in Shiprocket");
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getTrackingDetails(awbCode) {
  try {
    const response = await trackShiprocketOrder(awbCode);
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function cancelShipment(orderId, awbCode) {
  const supabase = createAdminClient();
  try {
    const response = await cancelShiprocketOrder([awbCode]);
    
    await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", orderId);

    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function initiateReturn(orderId) {
  const supabase = createAdminClient();
  try {
    const { data: order, error } = await supabase
      .from("orders")
      .select("*, order_items(*), profiles(first_name, last_name, email)")
      .eq("id", orderId)
      .single();

    if (error) throw error;

    const returnPayload = {
      order_id: `${order.id}-RET`,
      order_date: new Date().toISOString().split('T')[0],
      channel_id: "",
      pickup_customer_name: order.profiles?.first_name || "Customer",
      pickup_last_name: order.profiles?.last_name || "",
      pickup_address: order.shipping_address || "Address",
      pickup_address_2: "",
      pickup_city: order.shipping_city || "City",
      pickup_state: order.shipping_state || "State",
      pickup_country: "India",
      pickup_pincode: order.shipping_address_pincode || "110001",
      pickup_email: order.profiles?.email || "email@example.com",
      pickup_phone: order.customer_phone || "0000000000",
      shipping_customer_name: "Srijan Fashion",
      shipping_last_name: "",
      shipping_address: "Your Warehouse Address",
      shipping_address_2: "",
      shipping_city: "Santipur",
      shipping_country: "India",
      shipping_pincode: "741404",
      shipping_state: "West Bengal",
      shipping_email: "support@srijanfashion.com",
      shipping_phone: "0000000000",
      order_items: order.order_items.map(item => ({
        name: "Product Variant " + item.variant_id,
        sku: "SKU-" + item.variant_id,
        units: item.quantity,
        selling_price: item.price
      })),
      payment_method: "PREPAID",
      sub_total: order.total_amount,
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5
    };

    const response = await createShiprocketReturn(returnPayload);
    
    if (response.order_id) {
       await supabase
         .from("orders")
         .update({ status: "returned" })
         .eq("id", orderId);
    }

    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function submitNDRAction(orderId, awb, actionType) {
  const supabase = createAdminClient();
  try {
    const response = await takeNDRAction(awb, actionType);
    
    if (actionType === 'return') {
      await supabase
        .from("orders")
        .update({ status: "returned" })
        .eq("id", orderId);
    }
    
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function requestPickup(shipmentId) {
  try {
    const response = await scheduleShiprocketPickup(shipmentId);
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function generateLabel(shipmentId) {
  try {
    const response = await getShiprocketLabel(shipmentId);
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function generateInvoice(shiprocketOrderId) {
  try {
    const response = await getShiprocketInvoice(shiprocketOrderId);
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
}