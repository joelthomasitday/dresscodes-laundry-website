import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend("re_e8DTFskf_FtfCyCBwqRmJRar7EFLizP41")

export async function POST(request: NextRequest) {
  try {
    const contactData = await request.json()
    const { name, email, phone, subject, message } = contactData

    // Send email to business owner
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "hellodresscodes@gmail.com",
      subject: `New Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
        <hr>
        <p><small>Submitted at: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</small></p>
      `,
    })

    // Send auto-reply to customer
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Thank you for contacting Dresscode Laundry",
      html: `
        <h2>Thank you for your message!</h2>
        <p>Dear ${name},</p>
        <p>We've received your message and will get back to you within 24 hours.</p>
        <p><strong>Your message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
        <hr>
        <p>Best regards,<br>Dresscode Laundry Team</p>
        <p>Phone: +91 89434 37272<br>Email: hellodresscodes@gmail.com</p>
      `,
    })

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
    })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
