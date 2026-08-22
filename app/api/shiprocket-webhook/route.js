import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const payload = await req.json();
    const supabase = createAdminClient();

    const awb = payload.awb;
    const currentStatus = payload.current_status;

    if (!awb || !currentStatus) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    let newStatus = 'processing';
    const statusLower = currentStatus.toLowerCase();

    // Separate statuses for Shipped and Out for Delivery
    if (statusLower.includes('out for delivery')) {
      newStatus = 'out_for_delivery';
    } else if (statusLower.includes('shipped') || statusLower.includes('in transit')) {
      newStatus = 'shipped';
    } else if (statusLower.includes('delivered')) {
      newStatus = 'delivered';
    } else if (statusLower.includes('cancelled')) {
      newStatus = 'cancelled';
    } else if (statusLower.includes('rto') || statusLower.includes('returned')) {
      newStatus = 'returned';
    }

    const { data: orderData, error: fetchError } = await supabase
      .from('orders')
      .select('id, status, total_amount, shipping_address, profiles(first_name, email)')
      .eq('tracking_number', awb)
      .single();

    if (fetchError || !orderData) throw fetchError;

    if (orderData.status !== newStatus) {
      await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('tracking_number', awb);

      const customerEmail = orderData.profiles?.email;
      const customerName = orderData.profiles?.first_name || 'Customer';
      
      if (customerEmail) {
        const displayOrderId = orderData.id.split('-')[0].toUpperCase();
        
        let addressHtml = '';
        if (orderData.shipping_address) {
          const addr = typeof orderData.shipping_address === 'string' ? JSON.parse(orderData.shipping_address) : orderData.shipping_address;
          addressHtml = `${addr.street || ''}, ${addr.city || ''}, ${addr.state || ''} - ${addr.postalCode || ''}`;
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

        if (newStatus === 'shipped') {
          subject = `Order Shipped - #${displayOrderId} | SRIJAN Fashion`;
          topIcon = '[TRUCK_ICON_URL]'; 
          headerText = 'Your Order Is On Its Way!';
          messageHtml = `
            <p style="margin-bottom: 15px;">Your order <strong>#${displayOrderId}</strong> is officially on its way!</p>
            <p style="margin-bottom: 15px;">Your tracking details will be shared by courier partner: <strong>Shiprocket</strong>. You can use those details to track your package.</p>
            <p style="margin-bottom: 15px; color: #4b5563;">Please keep your phone available around the expected delivery date so the courier partner can contact you if required.</p>
            <p style="font-style: italic; color: #6b7280; margin-top: 20px;">We hope you enjoy your <strong>SRIJAN Fashion</strong> purchase.</p>
          `;
        } 
        else if (newStatus === 'out_for_delivery') {
          subject = `Order Out For Delivery - #${displayOrderId} | SRIJAN Fashion`;
          topIcon = '[BIKE_DELIVERY_ICON_URL]'; // আপনার Delivery Boy/Bike ইমেজের লিংক দিন
          headerText = 'Your Order Is Out For Delivery!';
          messageHtml = `
            <p style="margin-bottom: 15px;">Exciting news! Your SRIJAN Fashion order <strong>#${displayOrderId}</strong> is out for delivery today.</p>
            <p style="margin-bottom: 15px;">Your package is currently with the delivery partner and should reach you soon.</p>
            <h3 style="margin-top: 25px; margin-bottom: 10px; font-size: 16px; color: #111;">Delivery Details</h3>
            <p style="margin: 0 0 5px; color: #4b5563;">Order ID: <strong>#${displayOrderId}</strong></p>
            <p style="margin: 0 0 15px; color: #4b5563;">Courier Partner: <strong>Shiprocket</strong></p>
            
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
          topIcon = '[DELIVERED_ICON_URL]';
          headerText = 'Your Order Has Been Delivered!';
          messageHtml = `
            <p style="margin-bottom: 15px;">Your Srijan Fashion order <strong>#${displayOrderId}</strong> has been successfully delivered.</p>
            <p style="margin-bottom: 25px;">We hope your new outfit is exactly what you were looking for and that you enjoy wearing it.</p>
            
            <div style="text-align: center; margin-top: 40px; border-top: 1px solid #f3f4f6; padding-top: 30px;">
              <h3 style="margin: 0 0 10px; font-size: 18px; color: #111;">We'd Love to Hear From You</h3>
              <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px;">Your feedback helps us improve and also helps other customers make better choices.</p>
              <p style="font-weight: bold; color: #111; margin-bottom: 10px;">How was your experience?</p>
              <div style="color: #fbbf24; font-size: 28px; margin-bottom: 20px; letter-spacing: 5px;">★★★★★</div>
              <a href="[YOUR_REVIEW_LINK]" style="display: inline-block; background-color: #00c3ff; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 25px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(0, 195, 255, 0.2);">Submit Review</a>
            </div>
            <p style="font-style: italic; color: #6b7280; margin-top: 30px; text-align: center;">Thank you for supporting <strong>SRIJAN Fashion</strong>. We truly appreciate your trust in our brand.</p>
          `;
        }

        if (subject !== '') {
          const htmlTemplate = `
            <div style="background-color: #f9fafb; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #374151;">
              <div style="text-align: center; margin-bottom: 20px;">
                <img src="${topIcon}" alt="Status Icon" style="width: 70px; height: auto; object-fit: contain;">
                <h1 style="color: #1f2937; font-size: 24px; font-weight: normal; margin-top: 15px;">${headerText}</h1>
              </div>
              <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 16px; border: 1px solid #e5e7eb; padding: 35px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);">
                <p style="font-weight: bold; font-size: 16px; margin-top: 0; margin-bottom: 20px; color: #111;">Hi, ${customerName},</p>
                <div style="font-size: 15px; line-height: 1.6; color: #4b5563;">
                  ${messageHtml}
                </div>
              </div>
              <div style="text-align: center; margin-top: 35px;">
                <img src="[LOGO_URL]" alt="SRIJAN Fashion" style="width: 70px; height: 70px; border-radius: 50%; object-fit: cover; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <p style="font-weight: bold; margin: 15px 0 5px; color: #111; font-size: 16px;">SRIJAN Fashion | Designer Boutique | Custom Fashion</p>
                <p style="color: #6b7280; font-size: 12px; margin: 0; max-width: 400px; margin: 0 auto; line-height: 1.5;">This is an automated generated email, please do not reply. For support visit our website.</p>
              </div>
            </div>
          `;

          await transporter.sendMail({
            from: `"SRIJAN Fashion" <${process.env.SMTP_USER}>`,
            to: customerEmail,
            subject: subject,
            html: htmlTemplate,
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}