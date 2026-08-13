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

    if (statusLower.includes('shipped') || statusLower.includes('in transit')) {
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
      .select('id, status, total_amount, profiles(first_name, email)')
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

        if (newStatus === 'shipped') {
          subject = `Order Shipped - #${displayOrderId} | SRIJAN Fashion`;
          messageHtml = `<p>Hi ${customerName},</p><p>Your order <strong>#${displayOrderId}</strong> has been shipped and is on its way to you! You can track it using AWB: <strong>${awb}</strong>.</p>`;
        } else if (newStatus === 'delivered') {
          subject = `Order Delivered - #${displayOrderId} | SRIJAN Fashion`;
          messageHtml = `<p>Hi ${customerName},</p><p>Your order <strong>#${displayOrderId}</strong> has been delivered successfully. Thank you for shopping with us!</p>`;
        }

        if (subject !== '') {
          await transporter.sendMail({
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
              </div>
            `,
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}