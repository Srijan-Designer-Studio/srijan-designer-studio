'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import nodemailer from 'nodemailer'

export async function sendWeddingInquiry(formData) {
  const supabase = createAdminClient()

  const name = formData.get('fullName')
  const email = formData.get('email')
  const phone = formData.get('phone')
  const outfitType = formData.get('outfitType')
  const budget = formData.get('budget')
  const callDate = formData.get('date')
  const callTime = formData.get('time')
  const details = formData.get('message')
  const sourcePage = formData.get('sourcePage') || 'Wedding Contact'

  if (!name || !phone || !callDate || !callTime || !email) {
    return { success: false, error: "Please fill all required fields." };
  }

  try {
    const { error } = await supabase.from('custom_requests').insert({
      name: name,
      email: email,
      phone: phone,
      outfit_type: outfitType,
      budget: budget,
      callback_date: callDate,
      callback_time: callTime,
      details: details,
      source_page: sourcePage
    })

    if (error) throw new Error(error.message)

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const mailOptions = {
      from: `"SRIJAN Fashion" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: `New Inquiry from ${name} (${sourcePage})`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #c98d45;">New Lead: ${sourcePage}</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone Number:</strong> ${phone}</p>
          <p><strong>Outfit Type:</strong> ${outfitType}</p>
          <p><strong>Budget Range:</strong> ${budget}</p>
          <p><strong>Call Back Date:</strong> ${callDate}</p>
          <p><strong>Call Back Time:</strong> ${callTime}</p>
          <p><strong>Source Page:</strong> ${sourcePage}</p>
          <p><strong>Message:</strong><br/> ${details || 'No message provided.'}</p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    return { success: true, message: "Your inquiry has been sent successfully!" }
  } catch (err) {
    console.error("Submission Error:", err)
    return { success: false, error: "Failed to submit. Please try again." }
  }
}