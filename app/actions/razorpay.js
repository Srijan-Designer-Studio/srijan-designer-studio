'use server'

import Razorpay from 'razorpay'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function createRazorpayOrder(amount, dbOrderId) {
  try {
    if (!amount || amount <= 0 || !dbOrderId) {
      return { success: false, error: 'Invalid order details provided' }
    }

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return { success: false, error: 'Payment gateway configuration missing' }
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })

    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: 'INR',
      receipt: `rcpt_${dbOrderId}`.substring(0, 40),
    }

    const order = await razorpay.orders.create(options)

    if (!order || !order.id) {
      throw new Error('Razorpay order creation failed')
    }

    return { success: true, order }
  } catch (error) {
    return { success: false, error: 'Could not initialize payment gateway' }
  }
}

export async function verifyRazorpayPayment(paymentId, orderId, signature, dbOrderId) {
  try {
    if (!paymentId || !orderId || !signature || !dbOrderId) {
      return { success: false, error: 'Incomplete payment details provided' }
    }

    const body = orderId + '|' + paymentId

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex')

    const isAuthentic = expectedSignature === signature

    if (!isAuthentic) {
      return { success: false, error: 'Payment signature verification failed' }
    }

    const supabase = createAdminClient()

    const { error } = await supabase
      .from('orders')
      .update({
        payment_status: 'Paid',
        status: 'processing',
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature
      })
      .eq('id', dbOrderId)

    if (error) {
      return { success: false, error: 'Database update failed after payment verification' }
    }

    revalidatePath('/account/orders')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to verify payment securely' }
  }
}