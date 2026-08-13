import { NextResponse } from 'next/server';
import PaytmChecksum from 'paytmchecksum';
import { createAdminClient } from '@/lib/supabase/admin';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const body = Object.fromEntries(formData);

    const paytmChecksum = body.CHECKSUMHASH;
    delete body.CHECKSUMHASH;

    const isVerifySignature = PaytmChecksum.verifySignature(body, process.env.PAYTM_MERCHANT_KEY, paytmChecksum);

    if (isVerifySignature) {
      const supabase = createAdminClient();
      const orderId = body.ORDERID;

      if (body.STATUS === 'TXN_SUCCESS') {
        await supabase
          .from('orders')
          .update({
            payment_status: 'Paid',
            status: 'processing',
            updated_at: new Date().toISOString()
          })
          .eq('id', orderId);

        const { data: orderData } = await supabase
          .from('orders')
          .select('total_amount, profiles(first_name, email)')
          .eq('id', orderId)
          .single();

        if (orderData) {
          const customerEmail = orderData.profiles?.email;
          const customerName = orderData.profiles?.first_name || 'Customer';
          const displayOrderId = orderId.split('-')[0].toUpperCase();

          if (customerEmail) {
            const transporter = nodemailer.createTransport({
              host: process.env.SMTP_HOST,
              port: process.env.SMTP_PORT,
              secure: process.env.SMTP_SECURE === 'true',
              auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
              },
            });

            await transporter.sendMail({
              from: `"SRIJAN Fashion" <${process.env.SMTP_USER}>`,
              to: customerEmail,
              subject: `Payment Successful & Order Confirmed - #${displayOrderId} | SRIJAN Fashion`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                  <h2 style="color: #0ba6ff; border-bottom: 2px solid #0ba6ff; padding-bottom: 10px; margin-top: 0;">SRIJAN Fashion</h2>
                  <div style="color: #4a5568; font-size: 16px; margin-top: 20px; line-height: 1.6;">
                    <p>Hi ${customerName},</p>
                    <p>Great news! We have successfully received your payment. Your order <strong>#${displayOrderId}</strong> is now confirmed and is being processed.</p>
                    <p style="margin-top: 20px; font-weight: bold;">Amount Paid: ₹${Number(orderData.total_amount).toLocaleString('en-IN')}</p>
                    <p style="margin-top: 20px;">We will notify you again via email once your order has been shipped. Thank you for choosing SRIJAN Fashion!</p>
                  </div>
                </div>
              `,
            });
          }
        }

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/account/orders?status=success`, 303);
      } else {
        await supabase
          .from('orders')
          .update({
            payment_status: 'Failed',
            updated_at: new Date().toISOString()
          })
          .eq('id', orderId);

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/checkout?status=failed`, 303);
      }
    } else {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/checkout?status=checksum_failed`, 303);
    }
  } catch (error) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/checkout?status=error`, 303);
  }
}