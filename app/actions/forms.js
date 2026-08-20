'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import nodemailer from 'nodemailer'

export async function submitContactMessage(formData) {
  const supabase = createAdminClient()

  const name = formData.get('name')
  const phone = formData.get('phone')
  const email = formData.get('email')
  const message = formData.get('message')

  const { error } = await supabase.from('contact_messages').insert({
    name,
    email,
    phone,
    message
  })

  if (error) throw new Error(error.message)

  try {
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
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, 
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #00c3ff; border-bottom: 2px solid #00c3ff; padding-bottom: 10px;">New Message Received</h2>
          <p style="color: #4a5568; font-size: 16px;">You have received a new message from the Srijan Fashion website contact form.</p>
          <div style="background-color: #f7fafc; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> ${phone}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
          </div>
          <h3 style="color: #2d3748; margin-top: 20px;">Message:</h3>
          <div style="background-color: #f7fafc; padding: 15px; border-radius: 8px; font-style: italic; color: #4a5568;">
            <p style="margin: 0;">${message}</p>
          </div>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
  } catch (err) {
    console.error(err)
  }

  return { success: true }
}

export async function submitCustomRequest(formData) {
  const supabase = createAdminClient()

  const name = formData.get('name')
  const email = formData.get('email')
  const phone = formData.get('phone')
  const outfitType = formData.get('outfitType')
  const budget = formData.get('budget')
  const callDate = formData.get('callDate')
  const callTime = formData.get('callTime')
  const details = formData.get('details')
  const sourcePage = formData.get('sourcePage') || 'Perfect Fit'

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

  await sendNotificationEmail({ name, email, phone, outfitType, budget, callDate, callTime, details, sourcePage })

  return { success: true }
}

export async function submitKidsForm(formData) {
  const supabase = createAdminClient()

  const name = formData.get('name')
  const email = formData.get('email')
  const phone = formData.get('phone')
  const outfitType = formData.get('outfitType')
  const budget = formData.get('budget')
  const callDate = formData.get('date')
  const callTime = formData.get('time')
  const details = formData.get('message')
  const sourcePage = formData.get('sourcePage') || 'Custom Kids Wear'

  const { error } = await supabase.from('custom_requests').insert({
    name: name, email: email, phone: phone, outfit_type: outfitType, 
    budget: budget, callback_date: callDate, callback_time: callTime, 
    details: details, source_page: sourcePage
  })

  if (error) return { success: false, error: error.message }

  await sendNotificationEmail({ name, email, phone, outfitType, budget, callDate, callTime, details, sourcePage })
  return { success: true }
}

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

  const { error } = await supabase.from('custom_requests').insert({
    name: name, email: email, phone: phone, outfit_type: outfitType, 
    budget: budget, callback_date: callDate, callback_time: callTime, 
    details: details, source_page: sourcePage
  })

  if (error) return { success: false, error: error.message }

  await sendNotificationEmail({ name, email, phone, outfitType, budget, callDate, callTime, details, sourcePage })
  return { success: true, message: "Your inquiry has been sent successfully!" }
}

async function sendNotificationEmail(data) {
  try {
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
      from: `"${data.name}" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: data.email,
      subject: `New Request: ${data.sourcePage} from ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #00c3ff; border-bottom: 2px solid #00c3ff; padding-bottom: 10px;">New Request: ${data.sourcePage}</h2>
          <div style="background-color: #f7fafc; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Outfit Type:</strong> ${data.outfitType}</p>
            <p><strong>Budget:</strong> ${data.budget}</p>
            <p><strong>Call Back Date:</strong> ${data.callDate}</p>
            <p><strong>Call Back Time:</strong> ${data.callTime}</p>
          </div>
          <h3 style="color: #2d3748; margin-top: 20px;">Message/Details:</h3>
          <div style="background-color: #f7fafc; padding: 15px; border-radius: 8px; font-style: italic; color: #4a5568;">
            <p style="margin: 0;">${data.details || 'No additional details provided.'}</p>
          </div>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
  } catch (err) {
    console.error("Email sending failed:", err)
  }
}