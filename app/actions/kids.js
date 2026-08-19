'use server'

import nodemailer from 'nodemailer'


export async function submitKidsForm(formData) {
  try {
    
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const outfitType = formData.get('outfitType');
    const budget = formData.get('budget');
    const date = formData.get('date');
    const time = formData.get('time');
    const message = formData.get('message');
    const sourcePage = formData.get('sourcePage') || 'Custom Kids Wear';

    if (!name || !email || !phone || !date || !time) {
      throw new Error('Please fill out all required fields.')
    }

    // ==========================================
    // Database
    // ==========================================
    
    
    await prisma.inquiry.create({
      data: {
        name, email, phone, outfitType, budget, date, time, message, sourcePage, createdAt: new Date()
      }
    });
    

    // ==========================================
    //  Nodemailer
    // ==========================================
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
      from: `"SRIJAN Kids" <${process.env.SMTP_USER}>`,
      to: 'ripanpramanik01@gmail.com', // আপনার ইমেইল
      subject: `New Kids Customization Request from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #0ba6ff;">Kids Wear Customization Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone Number:</strong> ${phone}</p>
          <p><strong>Outfit Type:</strong> ${outfitType}</p>
          <p><strong>Budget Range:</strong> ${budget}</p>
          <p><strong>Preferred Call Date:</strong> ${date}</p>
          <p><strong>Preferred Call Time:</strong> ${time}</p>
          <p><strong>Source Page:</strong> ${sourcePage}</p>
          <p><strong>Message/Requirements:</strong><br/> ${message || 'No specific message provided.'}</p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)

    return { success: true }
  } catch (error) {
    console.error("Kids Form Error:", error);
    return { success: false, error: error.message }
  }
}