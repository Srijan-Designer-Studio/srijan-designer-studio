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
import { unstable_noStore as noStore } from 'next/cache';

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

    const { data: searchKeywords } = await supabase
      .from('search_keywords')
      .select('*')
      .order('searches', { ascending: false })
      .limit(5);

    const keywords = searchKeywords || [];

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
  const supabase = createAdminClient();

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.srijandesignerstudio.com';

  try {
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (updateError) throw updateError;

    const { data: orderData, error: fetchError } = await supabase
      .from('orders')
      .select(`
        id,
        status,
        total_amount,
        user_id,
        created_at,
        shipping_address,
        payment_status,
        order_items (
          quantity,
          price,
          variant_id
        )
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
      const orderDate = new Date(orderData.created_at || Date.now()).toLocaleDateString('en-IN');
      const totalAmount = Number(orderData.total_amount).toLocaleString('en-IN');
      
      let addressHtml = '';
      if (orderData.shipping_address) {
        const addr = typeof orderData.shipping_address === 'string' ? JSON.parse(orderData.shipping_address) : orderData.shipping_address;
        const line1 = addr.addressLine1 || '';
        const line2 = addr.addressLine2 ? `${addr.addressLine2}, ` : '';
        const city = addr.city || '';
        const state = addr.state || '';
        const zip = addr.zip || addr.postalCode || '';
        addressHtml = `${line1}, ${line2}${city}, ${state} - ${zip}`;
      }

      let itemsHtml = '';
      let totalItemsCount = 0;
      
      if (orderData.order_items && orderData.order_items.length > 0) {
        const variantIds = orderData.order_items.map(i => i.variant_id).filter(Boolean);
        let variants = [];
        
        if (variantIds.length > 0) {
          const { data: vData } = await supabase
            .from('product_variants')
            .select('id, products(title)')
            .in('id', variantIds);
          variants = vData || [];
        }

        orderData.order_items.forEach(item => {
          const variant = variants.find(v => v.id === item.variant_id);
          const title = variant?.products?.title || 'SRIJAN Fashion Product';
          totalItemsCount += item.quantity;
          
          itemsHtml += `
            <tr>
              <td style="border-bottom: 1px solid #e5e7eb; padding: 10px; color: #374151; border-right: 1px solid #e5e7eb; font-size: 13px;">${title}</td>
              <td style="border-bottom: 1px solid #e5e7eb; padding: 10px; text-align: center; color: #374151; border-right: 1px solid #e5e7eb; font-size: 13px;">${item.quantity}</td>
              <td style="border-bottom: 1px solid #e5e7eb; padding: 10px; text-align: right; color: #374151; font-size: 13px;">₹ ${(item.price * item.quantity).toLocaleString('en-IN')}</td>
            </tr>
          `;
        });
      } else {
        totalItemsCount = 1;
        itemsHtml = `
          <tr>
            <td style="border-bottom: 1px solid #e5e7eb; padding: 10px; color: #374151; border-right: 1px solid #e5e7eb; font-size: 13px;">SRIJAN Fashion Product</td>
            <td style="border-bottom: 1px solid #e5e7eb; padding: 10px; text-align: center; color: #374151; border-right: 1px solid #e5e7eb; font-size: 13px;">1</td>
            <td style="border-bottom: 1px solid #e5e7eb; padding: 10px; text-align: right; color: #374151; font-size: 13px;">₹ ${totalAmount}</td>
          </tr>
        `;
      }

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
      let topIcon = '';
      let headerText = '';
      let messageHtml = '';

      if (newStatus === 'processing') {
        subject = `Order Accepted - #${displayOrderId} | SRIJAN Fashion`;
        topIcon = `${BASE_URL}/email-img/1.webp`; 
        headerText = 'Thank You For Your Order!';
        
        const paymentStatusText = orderData.payment_status ? orderData.payment_status.toUpperCase() : 'PAID';

        messageHtml = `
          <p style="margin-bottom: 15px; font-size: 14px; color: #374151;">We're happy to confirm that we've received your order successfully. Our team will now begin processing your order.</p>
          
          <h3 style="margin-top: 25px; margin-bottom: 10px; font-size: 15px; color: #111;">Order Details</h3>
          <p style="margin: 0 0 4px; color: #374151; font-size: 13px;">Order ID: ${displayOrderId}</p>
          <p style="margin: 0 0 4px; color: #374151; font-size: 13px;">Order Date: ${orderDate}</p>
          <p style="margin: 0 0 4px; color: #374151; font-size: 13px;">Payment Status: ${paymentStatusText}</p>
          <p style="margin: 0 0 15px; color: #374151; font-size: 13px;">Order Total: ₹${totalAmount}</p>

          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-top: 15px; border: 1px solid #e5e7eb; font-size: 13px;">
            <thead>
              <tr>
                <th colspan="3" style="background-color: #38bdf8; color: #111; padding: 10px; text-align: center; font-size: 15px; border-bottom: 1px solid #e5e7eb;">Order Details</th>
              </tr>
              <tr style="background-color: #f9fafb;">
                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; font-style: italic; font-weight: bold; color: #111;">ITEMS</th>
                <th style="padding: 10px; text-align: center; border-bottom: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; font-weight: bold; color: #111;">QTY</th>
                <th style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #111;">PRICE</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              <tr>
                <td colspan="2" style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; color: #374151; font-size: 13px;">Subtotal (${totalItemsCount} items):</td>
                <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb; color: #374151; font-size: 13px;">₹ ${totalAmount}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; color: #374151; font-size: 13px;">Shipping Rate:</td>
                <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb; color: #374151; font-size: 13px;">Free</td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold; color: #111; border-right: 1px solid #e5e7eb; font-size: 13px;">Order Total:</td>
                <td style="padding: 10px; text-align: right; font-weight: bold; color: #111; font-size: 13px;">₹ ${totalAmount}</td>
              </tr>
            </tbody>
          </table>

          ${addressHtml ? `
          <h3 style="margin-top: 25px; margin-bottom: 5px; font-size: 14px; color: #111;">Delivery Address</h3>
          <p style="margin: 0; color: #374151; font-size: 13px; line-height: 1.5;">${addressHtml}</p>
          ` : ''}

          <p style="margin-top: 25px; color: #374151; font-size: 13px;">We'll keep you updated as your order moves through each stage of the process.</p>
          <p style="margin-top: 15px; color: #374151; font-size: 13px;">If you have any questions regarding your order, please contact our support team.</p>
          <p style="margin-top: 20px; color: #111; font-size: 13px; font-style: italic;">Thank you for choosing <strong>SRIJAN Fashion</strong>.</p>
        `;
      } 
      else if (newStatus === 'packed') {
        subject = `Order Packed - #${displayOrderId} | SRIJAN Fashion`;
        topIcon = `${BASE_URL}/email-img/2.webp`; 
        headerText = 'Hooray! Your Order Is Packed';
        messageHtml = `
          <p style="margin-bottom: 15px;">Good news! Your order <strong>#${displayOrderId}</strong> has been packed and is ready to leave our studio.</p>
          <h3 style="margin-top: 25px; margin-bottom: 10px; font-size: 16px; color: #111;">Order Details</h3>
          <p style="margin: 0 0 5px; color: #4b5563;">Order ID: <strong>#${displayOrderId}</strong></p>
          <p style="margin: 0 0 5px; color: #4b5563;">Order Total: <strong>₹${totalAmount}</strong></p>
          <p style="margin-top: 25px; color: #4b5563;">Our team has carefully prepared your package and it will soon move to the next stage of delivery. We'll notify you once your order has been shipped.</p>
        `;
      } 
      else if (newStatus === 'shipped') {
        subject = `Order Shipped - #${displayOrderId} | SRIJAN Fashion`;
        topIcon = `${BASE_URL}/email-img/3.webp`; 
        headerText = 'Your Order Is On Its Way!';
        messageHtml = `
          <p style="margin-bottom: 15px;">Your order <strong>#${displayOrderId}</strong> is officially on its way!</p>
          <p style="margin-bottom: 15px;">Your tracking details will be shared by our courier partner soon. You can use those details to track your package.</p>
          <p style="margin-bottom: 15px;">Please keep your phone available around the expected delivery date so the courier partner can contact you if required.</p>
          <p style="font-style: italic; color: #6b7280; margin-top: 20px;">We hope you enjoy your <strong>SRIJAN Fashion</strong> purchase.</p>
        `;
      } 
      else if (newStatus === 'out_for_delivery') {
        subject = `Order Out For Delivery - #${displayOrderId} | SRIJAN Fashion`;
        topIcon = `${BASE_URL}/email-img/4.webp`; 
        headerText = 'Your Order Is Out For Delivery!';
        messageHtml = `
          <p style="margin-bottom: 15px;">Exciting news! Your SRIJAN Fashion order <strong>#${displayOrderId}</strong> is out for delivery today.</p>
          <p style="margin-bottom: 15px;">Your package is currently with the delivery partner and should reach you soon.</p>
          <h3 style="margin-top: 25px; margin-bottom: 10px; font-size: 16px; color: #111;">Delivery Details</h3>
          <p style="margin: 0 0 5px; color: #4b5563;">Order ID: <strong>#${displayOrderId}</strong></p>
          
          ${addressHtml ? `
          <h3 style="margin-top: 20px; margin-bottom: 5px; font-size: 14px; color: #111;">Delivery Address</h3>
          <p style="margin: 0 0 15px; color: #4b5563; line-height: 1.5;">${addressHtml}</p>
          ` : ''}
          
          <p style="margin-bottom: 15px; color: #4b5563;">Please keep your phone available in case the delivery partner needs to contact you.</p>
          <p style="font-style: italic; color: #6b7280; margin-top: 20px;">Thank you for shopping with <strong>SRIJAN Fashion</strong>. We hope you love your new outfit!</p>
        `;
      }
      else if (newStatus === 'delivered') {
        subject = `Order Delivered - #${displayOrderId} | SRIJAN Fashion`;
        topIcon = `${BASE_URL}/email-img/5.webp`; 
        headerText = 'Your Order Has Been Delivered!';
        messageHtml = `
          <p style="margin-bottom: 15px;">Your Srijan Fashion order <strong>#${displayOrderId}</strong> has been successfully delivered.</p>
          <p style="margin-bottom: 25px;">We hope your new outfit is exactly what you were looking for and that you enjoy wearing it.</p>
          
          <div style="text-align: center; margin-top: 40px; border-top: 1px solid #f3f4f6; padding-top: 30px;">
            <h3 style="margin: 0 0 10px; font-size: 18px; color: #111;">We'd Love to Hear From You</h3>
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px;">Your feedback helps us improve and also helps other customers make better choices.</p>
            <p style="font-weight: bold; color: #111; margin-bottom: 10px;">How was your experience?</p>
            <div style="color: #fbbf24; font-size: 28px; margin-bottom: 20px; letter-spacing: 5px;">★★★★★</div>
            <a href="${BASE_URL}/account/orders" style="display: inline-block; background-color: #00c3ff; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 25px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(0, 195, 255, 0.2);">Submit Review</a>
          </div>
          <p style="font-style: italic; color: #6b7280; margin-top: 30px; text-align: center;">Thank you for supporting <strong>SRIJAN Fashion</strong>. We truly appreciate your trust in our brand.</p>
        `;
      }
      else if (newStatus === 'cancelled') {
        subject = `Order Cancelled - #${displayOrderId} | SRIJAN Fashion`;
        topIcon = `${BASE_URL}/email-img/6.webp`; 
        headerText = 'Your Order Has Been Cancelled!';
        messageHtml = `
          <p style="margin-bottom: 15px;">Your order <strong>#${displayOrderId}</strong> has been successfully cancelled as requested.</p>
          <h3 style="margin-top: 25px; margin-bottom: 10px; font-size: 16px; color: #111;">Order Details</h3>
          <p style="margin: 0 0 5px; color: #4b5563;">Order ID: <strong>#${displayOrderId}</strong></p>
          <p style="margin: 0 0 5px; color: #4b5563;">Order Date: <strong>${orderDate}</strong></p>
          <p style="margin: 0 0 5px; color: #4b5563;">Cancelled On: <strong>${new Date().toLocaleDateString('en-IN')}</strong></p>
          <p style="margin: 0 0 15px; color: #4b5563;">Order Total: <strong>₹${totalAmount}</strong></p>
          <p style="margin-bottom: 15px; color: #4b5563;">A refund will be processed to your original payment method within 2-5 business days. If you need further assistance, please contact our support team.</p>
          <p style="font-style: italic; color: #6b7280; margin-top: 20px;">Thank you for choosing <strong>SRIJAN Fashion</strong>.</p>
        `;
      }
      else if (newStatus === 'return_requested') {
        subject = `Return Request Received - #${displayOrderId} | SRIJAN Fashion`;
        topIcon = `${BASE_URL}/email-img/7.webp`; 
        headerText = 'Return Request Received';
        messageHtml = `
          <p style="margin-bottom: 15px;">We’ve received your return request for order <strong>#${displayOrderId}</strong>.</p>
          <p style="margin-bottom: 15px;">Our team will review your request and verify that the item meets our return conditions. We’ll notify you once your return request has been reviewed and the next steps are available.</p>
          <h3 style="margin-top: 25px; margin-bottom: 10px; font-size: 16px; color: #111;">Return Details</h3>
          <p style="margin: 0 0 5px; color: #4b5563;">Order ID: <strong>#${displayOrderId}</strong></p>
          <p style="margin: 0 0 15px; color: #4b5563;">Requested On: <strong>${new Date().toLocaleDateString('en-IN')}</strong></p>
          <p style="margin-bottom: 15px; color: #4b5563;">Please keep the item unused, unwashed, with all original tags attached and in its original packaging until the return process is completed.</p>
          <p style="font-style: italic; color: #6b7280; margin-top: 20px;">If you have any questions, please contact our support team.</p>
        `;
      }
      else if (newStatus === 'return_approved' || newStatus === 'returned') {
        subject = `Return Approved - #${displayOrderId} | SRIJAN Fashion`;
        topIcon = `${BASE_URL}/email-img/8.webp`; 
        headerText = 'Return Approved!';
        messageHtml = `
          <p style="margin-bottom: 15px;">Your return request for order <strong>#${displayOrderId}</strong> has been approved.</p>
          <p style="margin-bottom: 15px;">A return pickup has been scheduled with our courier partner.</p>
          <h3 style="margin-top: 25px; margin-bottom: 10px; font-size: 16px; color: #111;">Next Steps</h3>
          <p style="margin-bottom: 15px; color: #4b5563;">Please ensure that the item is securely packed and meets our return conditions before handing it over to the courier partner.</p>
          <p style="margin-bottom: 15px; color: #4b5563;">Once the returned item reaches us and passes our quality inspection, we’ll proceed with the applicable refund or exchange.</p>
          <p style="font-style: italic; color: #6b7280; margin-top: 20px;">Thank you for your cooperation.</p>
        `;
      }
      else if (newStatus === 'return_rejected') {
        subject = `Return Rejected - #${displayOrderId} | SRIJAN Fashion`;
        topIcon = `${BASE_URL}/email-img/9.webp`; 
        headerText = 'Return Rejected!';
        messageHtml = `
          <p style="margin-bottom: 15px;">We’re sorry to inform you that your return request for order <strong>#${displayOrderId}</strong> could not be approved.</p>
          <p style="margin-bottom: 15px;">After reviewing the returned item(s) or your request details, we found that it did not meet one or more of our return conditions.</p>
          <h3 style="margin-top: 25px; margin-bottom: 10px; font-size: 16px; color: #111;">Return Details</h3>
          <p style="margin: 0 0 15px; color: #4b5563;">Reason: <strong>The items did not pass our quality inspection or the return window has expired.</strong></p>
          <p style="margin-bottom: 15px; color: #4b5563;">If you believe this decision was made in error or would like further clarification, please contact our support team.</p>
          <p style="font-style: italic; color: #6b7280; margin-top: 20px;">We’re here to help.</p>
        `;
      }
      else if (newStatus === 'refund_initiated') {
        subject = `Refund Initiated - #${displayOrderId} | SRIJAN Fashion`;
        topIcon = `${BASE_URL}/email-img/10.webp`; 
        headerText = 'Refund Initiated!';
        messageHtml = `
          <p style="margin-bottom: 15px;">Your refund for order <strong>#${displayOrderId}</strong> has been initiated successfully.</p>
          <h3 style="margin-top: 25px; margin-bottom: 10px; font-size: 16px; color: #111;">Refund Details</h3>
          <p style="margin: 0 0 5px; color: #4b5563;">Order ID: <strong>#${displayOrderId}</strong></p>
          <p style="margin: 0 0 5px; color: #4b5563;">Refund Amount: <strong>₹${totalAmount}</strong></p>
          <p style="margin: 0 0 15px; color: #4b5563;">Refund Initiated On: <strong>${new Date().toLocaleDateString('en-IN')}</strong></p>
          <p style="margin-bottom: 15px; color: #4b5563;">The refunded amount should reflect in your original payment method within 2-5 business days, depending on your bank or payment provider.</p>
          <p style="margin-bottom: 15px; color: #4b5563;">If you don’t receive the refund within the stated timeframe, please contact our support team.</p>
          <p style="font-style: italic; color: #6b7280; margin-top: 20px;">Thank you for your patience and for choosing <strong>SRIJAN Fashion</strong>.</p>
        `;
      }

      if (subject !== '') {
        const htmlTemplate = `
          <div style="background-color: #ffffff; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #374151;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="${topIcon}" alt="Status Icon" style="width: 70px; background-color: white; height: auto; object-fit: contain;">
              <h1 style="color: #1f2937; font-size: 24px; font-weight: normal; margin-top: 15px;">${headerText}</h1>
            </div>
            <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 16px; border: 1px solid #e5e7eb; padding: 35px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);">
              <p style="font-weight: bold; font-size: 16px; margin-top: 0; margin-bottom: 20px; color: #111;">Hi, ${customerName},</p>
              <div style="font-size: 15px; line-height: 1.6; color: #4b5563;">
                ${messageHtml}
              </div>
            </div>
            <div style="text-align: center; margin-top: 35px;">
              <img src="${BASE_URL}/email-img/logo.webp" alt="SRIJAN Fashion" style="width: 70px; height: 70px; border-radius: 50%; object-fit: cover; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <p style="font-weight: bold; margin: 15px 0 5px; color: #111; font-size: 16px;">SRIJAN Fashion | Designer Boutique | Custom Fashion</p>
              <p style="color: #6b7280; font-size: 12px; margin: 0; max-width: 400px; margin: 0 auto; line-height: 1.5;">This is an automated generated email, please do not reply. For support visit our website.</p>
            </div>
          </div>
        `;

        const mailOptions = {
          from: `"SRIJAN Fashion" <${process.env.SMTP_USER}>`,
          to: customerEmail,
          subject: subject,
          html: htmlTemplate,
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
  noStore();
  const supabase = createAdminClient()
  try {
    await verifyAdmin()
    const { data, error } = await supabase
      .from('products')
      .select('*, product_variants(*), product_images(*), product_addons!product_id(*)')
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

    const { data: compImages } = await supabase
      .from('product_components')
      .select('image_url')
      .eq('product_id', productId)
      .not('image_url', 'is', null)

    if (compImages && compImages.length > 0) {
      const compFilePaths = compImages.map(img => {
        const urlParts = img.image_url.split('/')
        const fileName = urlParts[urlParts.length - 1]
        return fileName.includes('addons/') ? fileName : `addons/${fileName}`
      })
      await supabase.storage.from('product-images').remove(compFilePaths)
    }

    await supabase.from('product_images').delete().eq('product_id', productId)
    await supabase.from('product_variants').delete().eq('product_id', productId)
    await supabase.from('product_components').delete().eq('product_id', productId)
    await supabase.from('product_addons').delete().eq('product_id', productId) 
    
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
    const schemaMarkup = formData.get('schemaMarkup');
    
    const flattenToStringArray = (arr) => {
      if (!Array.isArray(arr)) return [];
      return arr.map(item => {
        if (typeof item === 'object' && item !== null) {
          return item.name || item.value || item.label || item.text || item.id || '';
        }
        return String(item).trim();
      }).filter(Boolean);
    };

    const categories = flattenToStringArray(JSON.parse(formData.get('categories') || '[]'));
    const collections = flattenToStringArray(JSON.parse(formData.get('collections') || '[]'));
    const occasions = flattenToStringArray(JSON.parse(formData.get('occasions') || '[]'));
    const tags = flattenToStringArray(JSON.parse(formData.get('tags') || '[]'));
    
    const variants = JSON.parse(formData.get('variants') || '[]');
    const components = JSON.parse(formData.get('components') || '[]');
    const faqs = JSON.parse(formData.get('faqs') || '[]');
    
    const productAddons = JSON.parse(formData.get('productAddons') || '[]'); 
    const purchaseType = formData.get('purchaseType') || 'Single Product';

    const basePrice = parseFloat(formData.get('basePrice')) || 0;
    const salePrice = parseFloat(formData.get('salePrice')) || null;

    const rawSlug = seoSlug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const finalSlug = await generateUniqueSlug(supabase, rawSlug);

    let category_id = null;
    if (categories.length > 0) {
        if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(categories[0])) {
            category_id = categories[0];
        } else {
            const { data: catData } = await supabase.from('categories').select('id').ilike('name', categories[0]).maybeSingle();
            if (catData) category_id = catData.id;
        }
    }

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
        schema_markup: schemaMarkup,
        faqs: faqs,
        category_id: category_id,
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
      const componentInserts = [];
      for (let i = 0; i < components.length; i++) {
        const c = components[i];
        let imageUrl = c.preview || null;

        if (formData.has(`comp_file_${i}`)) {
          const file = formData.get(`comp_file_${i}`);
          const fileExt = file.name.split('.').pop();
          const fileName = `addons/${productId}-${Date.now()}-${i}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file);
          if (!uploadError) {
            imageUrl = supabase.storage.from('product-images').getPublicUrl(fileName).data.publicUrl;
          }
        }

        componentInserts.push({
          product_id: productId,
          name: c.name,
          component_type: c.type || 'Top',
          is_required: c.required,
          price: parseFloat(c.price) || 0,
          image_url: imageUrl
        });
      }
      await supabase.from('product_components').insert(componentInserts);
    }

    if (productAddons.length > 0) {
      const addonInserts = productAddons.map(addon => ({
        product_id: productId,
        addon_product_id: addon.addon_product_id || addon.id, 
        addon_type: addon.addon_type || addon.type || 'Add-on'
      }));
      await supabase.from('product_addons').insert(addonInserts);
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
    const schemaMarkup = formData.get('schemaMarkup');
    
    const flattenToStringArray = (arr) => {
      if (!Array.isArray(arr)) return [];
      return arr.map(item => {
        if (typeof item === 'object' && item !== null) {
          return item.name || item.value || item.label || item.text || item.id || '';
        }
        return String(item).trim();
      }).filter(Boolean);
    };

    const categories = flattenToStringArray(JSON.parse(formData.get('categories') || '[]'));
    const collections = flattenToStringArray(JSON.parse(formData.get('collections') || '[]'));
    const occasions = flattenToStringArray(JSON.parse(formData.get('occasions') || '[]'));
    const tags = flattenToStringArray(JSON.parse(formData.get('tags') || '[]'));

    const variants = JSON.parse(formData.get('variants') || '[]');
    const components = JSON.parse(formData.get('components') || '[]');
    const faqs = JSON.parse(formData.get('faqs') || '[]');
    const productAddons = JSON.parse(formData.get('productAddons') || '[]');
    const purchaseType = formData.get('purchaseType') || 'Single Product';

    const basePrice = parseFloat(formData.get('basePrice')) || 0;
    const salePrice = parseFloat(formData.get('salePrice')) || null;

    const rawSlug = seoSlug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const finalSlug = await generateUniqueSlug(supabase, rawSlug, productId);

    let category_id = null;
    if (categories.length > 0) {
        if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(categories[0])) {
            category_id = categories[0];
        } else {
            const { data: catData } = await supabase.from('categories').select('id').ilike('name', categories[0]).maybeSingle();
            if (catData) category_id = catData.id;
        }
    }

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
        schema_markup: schemaMarkup,
        faqs: faqs,
        category_id: category_id,
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
      const componentInserts = [];
      for (let i = 0; i < components.length; i++) {
        const c = components[i];
        let imageUrl = c.preview || null;

        if (formData.has(`comp_file_${i}`)) {
          const file = formData.get(`comp_file_${i}`);
          const fileExt = file.name.split('.').pop();
          const fileName = `addons/${productId}-${Date.now()}-${i}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file);
          if (!uploadError) {
            imageUrl = supabase.storage.from('product-images').getPublicUrl(fileName).data.publicUrl;
          }
        }

        componentInserts.push({
          product_id: productId,
          name: c.name,
          component_type: c.type || 'Top',
          is_required: c.required,
          price: parseFloat(c.price) || 0,
          image_url: imageUrl
        });
      }
      await supabase.from('product_components').insert(componentInserts);
    }

    await supabase.from('product_addons').delete().eq('product_id', productId);
    if (productAddons.length > 0) {
      const addonInserts = productAddons.map(addon => ({
        product_id: productId,
        addon_product_id: addon.addon_product_id || addon.id,
        addon_type: addon.addon_type || addon.type || 'Add-on'
      }));
      await supabase.from('product_addons').insert(addonInserts);
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

export async function searchProducts({
  searchTerm = '',
  categorySlug = null,
  minPrice = 0,
  maxPrice = 100000,
  sizes = [],
  colors = [],
  sortBy = 'newest',
  page = 1,
  limit = 12
}) {
  const supabase = createAdminClient()

  const from = (page - 1) * limit
  const to = from + limit - 1

  if (searchTerm && searchTerm.trim().length > 0) {
    const cleanTerm = searchTerm.trim().toLowerCase();
    const { data: existingKeyword } = await supabase
      .from('search_keywords')
      .select('id, searches')
      .eq('keyword', cleanTerm)
      .single();

    if (existingKeyword) {
      await supabase
        .from('search_keywords')
        .update({ searches: (existingKeyword.searches || 0) + 1 })
        .eq('id', existingKeyword.id);
    } else {
      await supabase
        .from('search_keywords')
        .insert({ keyword: cleanTerm, searches: 1, is_active: true, conversion_rate: 0 });
    }
  }

  let matchingCategoryIds = []
  if (searchTerm) {
    const { data: categories } = await supabase
      .from('categories')
      .select('id')
      .ilike('name', `%${searchTerm}%`)

    if (categories && categories.length > 0) {
      matchingCategoryIds = categories.map(c => c.id)
    }
  }

  let query = supabase
    .from('products')
    .select(`
      *,
      categories!inner(slug),
      product_images (image_url, display_order),
      product_variants!inner(size, color)
    `, { count: 'exact' })
    .eq('is_active', true)

  if (searchTerm) {
    let orQuery = `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,tags.ilike.%${searchTerm}%,keywords.ilike.%${searchTerm}%`

    if (matchingCategoryIds.length > 0) {
      orQuery += `,category_id.in.(${matchingCategoryIds.join(',')})`
    }

    query = query.or(orQuery)
  }

  if (categorySlug) {
    query = query.eq('categories.slug', categorySlug)
  }

  query = query.gte('base_price', minPrice).lte('base_price', maxPrice)

  if (sizes.length > 0) {
    query = query.in('product_variants.size', sizes)
  }

  if (colors.length > 0) {
    query = query.in('product_variants.color', colors)
  }

  if (sortBy === 'price_asc') {
    query = query.order('base_price', { ascending: true })
  } else if (sortBy === 'price_desc') {
    query = query.order('base_price', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  query = query.range(from, to)

  const { data, count, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  const uniqueProducts = Array.from(new Map(data.map(p => [p.id, p])).values())

  return {
    products: uniqueProducts,
    totalCount: count,
    totalPages: Math.ceil((count || 0) / limit),
    currentPage: page
  }
}