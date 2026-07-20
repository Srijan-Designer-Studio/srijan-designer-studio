import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client bypassing Row Level Security (RLS)
// IMPORTANT: Add SUPABASE_SERVICE_ROLE_KEY to your .env.local
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY 
);

export async function POST(req) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // 1. Verify the Razorpay signature to ensure the request is authentic
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    // 2. Handle Payment Success
    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      // Assuming you passed your Database Order ID in Razorpay's notes object during checkout
      const dbOrderId = event.payload.payment.entity.notes.orderId;
      const razorpayPaymentId = event.payload.payment.entity.id;

      if (!dbOrderId) {
        console.error("Missing database order ID in Razorpay notes");
        return NextResponse.json({ error: 'Order ID missing' }, { status: 400 });
      }

      // 3. Update the order status in PostgreSQL
      const { error } = await supabaseAdmin
        .from('orders')
        .update({ 
          status: 'processing',
          payment_id: razorpayPaymentId,
          updated_at: new Date().toISOString()
        })
        .eq('id', dbOrderId);

      if (error) throw new Error(error.message);

      return NextResponse.json({ status: 'success' }, { status: 200 });
    }

    // 3. Handle Payment Failures
    if (event.event === 'payment.failed') {
      const dbOrderId = event.payload.payment.entity.notes.orderId;
      
      if (dbOrderId) {
        await supabaseAdmin
          .from('orders')
          .update({ 
            status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('id', dbOrderId);
      }
      return NextResponse.json({ status: 'recorded_failure' }, { status: 200 });
    }

    // Acknowledge unhandled events
    return NextResponse.json({ status: 'unhandled_event' }, { status: 200 });

  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed.' },
      { status: 500 }
    );
  }
}