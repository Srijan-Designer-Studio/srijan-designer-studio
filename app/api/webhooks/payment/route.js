import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// For Stripe/Razorpay, you typically need the raw body to verify the webhook signature.
// Next.js App Router parses JSON by default, so we read it as text.
export async function POST(req) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('stripe-signature') || req.headers.get('x-razorpay-signature')

    // 1. Verify Signature (Pseudocode - replace with actual Stripe/Razorpay SDK method)
    // const event = stripe.webhooks.constructEvent(rawBody, signature, process.env.WEBHOOK_SECRET)
    
    // For this implementation, we will parse the raw body assuming signature verification passed
    const event = JSON.parse(rawBody)

    // 2. Handle the specific payment success event
    // e.g., 'checkout.session.completed' for Stripe, 'payment.captured' for Razorpay
    if (event.type === 'checkout.session.completed' || event.event === 'payment.captured') {
      
      const session = event.data?.object || event.payload?.payment?.entity
      
      // The orderId should be passed as metadata when creating the payment session
      const orderId = session.metadata?.orderId || session.notes?.orderId

      if (!orderId) {
        throw new Error('Order ID missing from webhook metadata')
      }

      // 3. Update Order Status using the Admin Client (bypasses RLS)
      const supabaseAdmin = createAdminClient()
      
      const { error } = await supabaseAdmin
        .from('orders')
        .update({ 
          payment_status: 'completed',
          status: 'processing',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)

      if (error) {
        console.error('Failed to update order in database:', error)
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
      }

      // Optional: Trigger email notification here
    }

    return NextResponse.json({ received: true }, { status: 200 })

  } catch (error) {
    console.error('Webhook Error:', error.message)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 400 })
  }
}