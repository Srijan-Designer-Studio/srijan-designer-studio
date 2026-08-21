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

async function generateUniqueSlug(supabase, baseSlug, excludeId = null) {
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    let query = supabase.from('products').select('id').eq('slug', slug);
    if (excludeId) {
      query = query.neq('id', excludeId);
    }
    const { data } = await query.maybeSingle();
    if (!data) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
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
      throw error;
    }
    return data || []
  } catch (error) {
    return []
  }
}

export async function deleteProduct(productId) {
  const supabase = createAdminClient()
  try {
    await verifyAdmin()

    const { data: images } = await supabase
      .from('product_images')
      .select('image_url')
      .eq('product_id', productId)

    if (images && images.length > 0) {
      const filePaths = images.map(img => {
        const urlParts = img.image_url.split('/')
        const fileName = urlParts[urlParts.length - 1]
        return fileName.includes('products/') ? fileName : `products/${fileName}`
      })
      await supabase.storage.from('product-images').remove(filePaths)
    }

    await supabase.from('product_images').delete().eq('product_id', productId)
    await supabase.from('product_variants').delete().eq('product_id', productId)
    await supabase.from('product_components').delete().eq('product_id', productId)
    
    await supabase.from('product_category_map').delete().eq('product_id', productId)
    await supabase.from('product_collection_map').delete().eq('product_id', productId)
    await supabase.from('product_occasion_map').delete().eq('product_id', productId)
    await supabase.from('product_tag_map').delete().eq('product_id', productId)

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

export async function createPremiumProduct(formData) {
  try {
    const supabase = createAdminClient(); 

    const title = formData.get('title') || 'Untitled';
    const productType = formData.get('productType');
    const brand = formData.get('brand');
    const shortDesc = formData.get('shortDesc');
    const description = formData.get('description');
    const materialCare = formData.get('materialCare');
    const highlights = formData.get('highlights');
    const additionalInfo = formData.get('additionalInfo');
    const department = formData.get('department');
    const weight = formData.get('weight') || 0;
    const length = formData.get('length') || 0;
    const width = formData.get('width') || 0;
    const height = formData.get('height') || 0;
    const shippingClass = formData.get('shippingClass');
    const estimatedDelivery = formData.get('estimatedDelivery');
    const isCodAvailable = formData.get('isCodAvailable') === 'true';
    const isFreeShipping = formData.get('isFreeShipping') === 'true';
    const isReturnEligible = formData.get('isReturnEligible') === 'true';
    const shippingPolicy = formData.get('shippingPolicy');
    const returnPolicy = formData.get('returnPolicy');
    const seoTitle = formData.get('seoTitle');
    const seoSlug = formData.get('seoSlug');
    const metaDesc = formData.get('metaDesc');
    const focusKeyword = formData.get('focusKeyword');
    const seoKeywords = formData.get('seoKeywords');
    const canonicalUrl = formData.get('canonicalUrl');
    
    const categories = JSON.parse(formData.get('categories') || '[]');
    const collections = JSON.parse(formData.get('collections') || '[]');
    const occasions = JSON.parse(formData.get('occasions') || '[]');
    const tags = JSON.parse(formData.get('tags') || '[]');
    
    const variants = JSON.parse(formData.get('variants') || '[]');
    const components = JSON.parse(formData.get('components') || '[]');
    const faqs = JSON.parse(formData.get('faqs') || '[]');
    const purchaseType = formData.get('purchaseType') || 'Single Product';

    const basePrice = parseFloat(formData.get('basePrice')) || 0;
    const salePrice = parseFloat(formData.get('salePrice')) || null;

    const rawSlug = seoSlug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const finalSlug = await generateUniqueSlug(supabase, rawSlug);

    const { data: productData, error: productError } = await supabase
      .from('products')
      .insert([{
        title,
        slug: finalSlug,
        short_description: shortDesc,
        full_description: description,
        material_care: materialCare,
        highlights,
        additional_info: additionalInfo,
        product_type: productType,
        brand,
        gender: department,
        base_price: basePrice,
        sale_price: salePrice,
        weight,
        length,
        width,
        height,
        shipping_class: shippingClass,
        estimated_delivery: estimatedDelivery,
        is_cod_available: isCodAvailable,
        is_free_shipping: isFreeShipping,
        is_return_eligible: isReturnEligible,
        shipping_policy: shippingPolicy,
        return_policy: returnPolicy,
        seo_title: seoTitle,
        meta_desc: metaDesc,
        focus_keyword: focusKeyword,
        seo_keywords: seoKeywords,
        canonical_url: canonicalUrl,
        faqs: faqs,
        categories: categories,
        collections: collections,
        occasions: occasions,
        tags: tags,
        purchase_type: purchaseType,
        is_active: true
      }])
      .select()
      .single();

    if (productError) throw productError;
    const productId = productData.id;

    const variantInserts = variants.map(v => ({
      product_id: productId,
      size: v.size,
      color: v.color,
      price: 0,
      sale_price: null,
      sku: v.sku,
      inventory_count: parseInt(v.stock) || 0,
      low_stock_threshold: parseInt(v.lowStock) || 5,
      barcode: v.barcode
    }));

    if (variantInserts.length > 0) {
      await supabase.from('product_variants').insert(variantInserts);
    }

    if (components.length > 0 && purchaseType !== 'Single Product') {
      const componentInserts = components.map(c => ({
        product_id: productId,
        name: c.name,
        is_required: c.required,
        price: parseFloat(c.price) || 0
      }));
      await supabase.from('product_components').insert(componentInserts);
    }

    let i = 0;
    const imageInserts = [];
    while (formData.has(`image_file_${i}`)) {
      const file = formData.get(`image_file_${i}`);
      const altText = formData.get(`image_alt_${i}`);
      const isPrimary = formData.get(`image_primary_${i}`) === 'true';
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${productId}-${Date.now()}-${i}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        imageInserts.push({
          product_id: productId,
          image_url: publicUrlData.publicUrl,
          alt_text: altText,
          is_primary: isPrimary,
          sort_order: i
        });
      }
      i++;
    }

    if (imageInserts.length > 0) {
      await supabase.from('product_images').insert(imageInserts);
    }

    revalidatePath('/admin/products', 'layout');
    return { success: true, productId };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updatePremiumProduct(formData) {
  try {
    const supabase = createAdminClient(); 

    const productId = formData.get('productId');
    const title = formData.get('title') || 'Untitled';
    const productType = formData.get('productType');
    const brand = formData.get('brand');
    const shortDesc = formData.get('shortDesc');
    const description = formData.get('description');
    const materialCare = formData.get('materialCare');
    const highlights = formData.get('highlights');
    const additionalInfo = formData.get('additionalInfo');
    const department = formData.get('department');
    const weight = formData.get('weight') || 0;
    const length = formData.get('length') || 0;
    const width = formData.get('width') || 0;
    const height = formData.get('height') || 0;
    const shippingClass = formData.get('shippingClass');
    const estimatedDelivery = formData.get('estimatedDelivery');
    const isCodAvailable = formData.get('isCodAvailable') === 'true';
    const isFreeShipping = formData.get('isFreeShipping') === 'true';
    const isReturnEligible = formData.get('isReturnEligible') === 'true';
    const shippingPolicy = formData.get('shippingPolicy');
    const returnPolicy = formData.get('returnPolicy');
    const seoTitle = formData.get('seoTitle');
    const seoSlug = formData.get('seoSlug');
    const metaDesc = formData.get('metaDesc');
    const focusKeyword = formData.get('focusKeyword');
    const seoKeywords = formData.get('seoKeywords');
    const canonicalUrl = formData.get('canonicalUrl');
    
    const categories = JSON.parse(formData.get('categories') || '[]');
    const collections = JSON.parse(formData.get('collections') || '[]');
    const occasions = JSON.parse(formData.get('occasions') || '[]');
    const tags = JSON.parse(formData.get('tags') || '[]');

    const variants = JSON.parse(formData.get('variants') || '[]');
    const components = JSON.parse(formData.get('components') || '[]');
    const faqs = JSON.parse(formData.get('faqs') || '[]');
    const purchaseType = formData.get('purchaseType') || 'Single Product';

    const basePrice = parseFloat(formData.get('basePrice')) || 0;
    const salePrice = parseFloat(formData.get('salePrice')) || null;

    const rawSlug = seoSlug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const finalSlug = await generateUniqueSlug(supabase, rawSlug, productId);

    const { error: productError } = await supabase
      .from('products')
      .update({
        title,
        slug: finalSlug,
        short_description: shortDesc,
        full_description: description,
        material_care: materialCare,
        highlights,
        additional_info: additionalInfo,
        product_type: productType,
        brand,
        gender: department,
        base_price: basePrice,
        sale_price: salePrice,
        weight,
        length,
        width,
        height,
        shipping_class: shippingClass,
        estimated_delivery: estimatedDelivery,
        is_cod_available: isCodAvailable,
        is_free_shipping: isFreeShipping,
        is_return_eligible: isReturnEligible,
        shipping_policy: shippingPolicy,
        return_policy: returnPolicy,
        seo_title: seoTitle,
        meta_desc: metaDesc,
        focus_keyword: focusKeyword,
        seo_keywords: seoKeywords,
        canonical_url: canonicalUrl,
        faqs: faqs,
        categories: categories,
        collections: collections,
        occasions: occasions,
        tags: tags,
        purchase_type: purchaseType
      })
      .eq('id', productId);

    if (productError) throw productError;

    await supabase.from('product_variants').delete().eq('product_id', productId);
    const variantInserts = variants.map(v => ({
      product_id: productId,
      size: v.size,
      color: v.color,
      price: 0,
      sale_price: null,
      sku: v.sku,
      inventory_count: parseInt(v.stock) || 0,
      low_stock_threshold: parseInt(v.lowStock) || 5,
      barcode: v.barcode
    }));
    if (variantInserts.length > 0) {
      await supabase.from('product_variants').insert(variantInserts);
    }

    await supabase.from('product_components').delete().eq('product_id', productId);
    if (components.length > 0 && purchaseType !== 'Single Product') {
      const componentInserts = components.map(c => ({
        product_id: productId,
        name: c.name,
        is_required: c.required,
        price: parseFloat(c.price) || 0
      }));
      await supabase.from('product_components').insert(componentInserts);
    }

    const imageInserts = [];
    let i = 0;
    while (formData.has(`image_file_${i}`) || formData.has(`existing_image_url_${i}`)) {
      if (formData.has(`image_file_${i}`)) {
        const file = formData.get(`image_file_${i}`);
        const altText = formData.get(`image_alt_${i}`);
        const isPrimary = formData.get(`image_primary_${i}`) === 'true';
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${productId}-${Date.now()}-${i}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, file);

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage.from('product-images').getPublicUrl(filePath);
          imageInserts.push({
            product_id: productId,
            image_url: publicUrlData.publicUrl,
            alt_text: altText,
            is_primary: isPrimary,
            sort_order: i
          });
        }
      } else if (formData.has(`existing_image_url_${i}`)) {
        imageInserts.push({
          product_id: productId,
          image_url: formData.get(`existing_image_url_${i}`),
          alt_text: formData.get(`existing_image_alt_${i}`),
          is_primary: formData.get(`existing_image_primary_${i}`) === 'true',
          sort_order: i
        });
      }
      i++;
    }

    await supabase.from('product_images').delete().eq('product_id', productId);
    if (imageInserts.length > 0) {
      await supabase.from('product_images').insert(imageInserts);
    }

    revalidatePath('/admin/products', 'layout');
    return { success: true, productId };
  } catch (error) {
    return { success: false, error: error.message };
  }
}