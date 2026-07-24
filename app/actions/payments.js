'use server'

import Razorpay from 'razorpay'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Initialize Razorpay instance securely on the server
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

export async function createRazorpayOrder(amount, dbOrderId) {
  try {
    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `rcpt_${dbOrderId}`,
    }

    const order = await razorpay.orders.create(options)
    
    if (!order) {
      throw new Error('Failed to create Razorpay order')
    }

    return { success: true, order }
  } catch (error) {
    console.error('Razorpay Error:', error)
    return { success: false, error: 'Could not initialize payment gateway' }
  }
}

export async function verifyRazorpayPayment(paymentId, orderId, signature, dbOrderId) {
  try {
    const body = orderId + '|' + paymentId

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex')

    const isAuthentic = expectedSignature === signature

    if (isAuthentic) {
      const supabase = await createClient()
      
      // Update order status in Supabase after successful verification
      const { error } = await supabase
        .from('orders')
        .update({ 
          payment_status: 'Paid',
          status: 'processing' 
        })
        .eq('id', dbOrderId)

      if (error) throw new Error(error.message)

      revalidatePath('/account/orders')
      return { success: true }
    } else {
      return { success: false, error: 'Payment signature verification failed' }
    }
  } catch (error) {
    console.error('Verification Error:', error)
    return { success: false, error: 'Failed to verify payment' }
  }
}