'use server'

import Razorpay from 'razorpay';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';

// Initialize Razorpay SDK (Server-side only)
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function createRazorpayOrder(amount, dbOrderId) {
  try {
    // Razorpay strictly requires amounts in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(Number(amount) * 100);

    if (amountInPaise < 100) {
      throw new Error("Amount must be at least ₹1.00");
    }

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: dbOrderId, // Link the Razorpay order to your DB order ID
    };

    const order = await razorpay.orders.create(options);
    
    return { success: true, order };
  } catch (error) {
    console.error("Razorpay Create Error:", error);
    throw new Error(error.message || "Failed to create Razorpay order");
  }
}

export async function verifyRazorpayPayment(razorpayPaymentId, razorpayOrderId, razorpaySignature, dbOrderId) {
  try {
    // 1. Recreate the HMAC-SHA256 signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    // 2. Compare signatures securely
    if (generatedSignature !== razorpaySignature) {
      throw new Error("Invalid payment signature. Verification failed.");
    }

    // 3. Signature matches! Synchronously mark the order as paid in Supabase.
    // (This acts as a fast fallback to your webhook for instant UI updates)
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('orders')
      .update({ 
        status: 'processing', 
        payment_id: razorpayPaymentId,
        updated_at: new Date().toISOString()
      })
      .eq('id', dbOrderId);

    if (error) throw new Error(error.message);

    return { success: true };
  } catch (error) {
    console.error("Razorpay Verify Error:", error);
    throw new Error(error.message || "Payment verification failed");
  }
}