'use server'

import nodemailer from 'nodemailer'

export async function sendWeddingInquiry(formData) {
  const name = formData.get('fullName');
  const phone = formData.get('phone');
  const date = formData.get('date');
  const time = formData.get('time');
  const message = formData.get('message');

  if (!name || !phone || !date || !time) {
    return { success: false, error: "Please fill all required fields." };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"SRIJAN Fashion Website" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, 
      subject: `New Wedding Inquiry from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #0ba6ff;">New Call Back Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone Number:</strong> ${phone}</p>
          <p><strong>Call Back Date:</strong> ${date}</p>
          <p><strong>Call Back Time:</strong> ${time}</p>
          <p><strong>Message:</strong><br/> ${message || 'No message provided.'}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: "Your inquiry has been sent successfully!" };
  } catch (error) {
    console.error("Email Error:", error);
    return { success: false, error: "Failed to send message. Please try again." };
  }
}