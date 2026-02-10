import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { PHONE_DISPLAY } from "@/lib/phone"



export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json()
    const { name, phone, email, address, selectedDate, timeSlot, selectedServices, specialInstructions } = bookingData
    const servicesText = selectedServices.join(", ")
    const bookingId = `BK${Date.now()}`
    
    const resend = new Resend(process.env.RESEND_API_KEY || "re_123");

    // Send email to business owner
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "hellodresscodes@gmail.com",
      subject: `New Booking Request - ${bookingId}`,
      html: `
        <h2>New Booking Request</h2>
        <p><strong>Booking ID:</strong> ${bookingId}</p>
        <p><strong>Customer:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email || "Not provided"}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Pickup Date:</strong> ${new Date(selectedDate).toLocaleDateString("en-IN")}</p>
        <p><strong>Time Slot:</strong> ${timeSlot}</p>
        <p><strong>Services:</strong> ${servicesText}</p>
        ${specialInstructions ? `<p><strong>Special Instructions:</strong> ${specialInstructions}</p>` : ""}
        <hr>
        <p><small>Submitted at: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</small></p>
      `,
    })

    console.log("Business email sent successfully")

    // Send confirmation to customer (if email provided)
    if (email) {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: `Booking Confirmation - ${bookingId}`,
        html: `
          <h2>Booking Confirmation</h2>
          <p>Dear ${name},</p>
          <p>Thank you for choosing Dresscode Laundry! Your booking has been received.</p>
          <p><strong>Booking Details:</strong></p>
          <ul>
            <li><strong>Booking ID:</strong> ${bookingId}</li>
            <li><strong>Pickup Date:</strong> ${new Date(selectedDate).toLocaleDateString("en-IN")}</li>
            <li><strong>Time Slot:</strong> ${timeSlot}</li>
            <li><strong>Services:</strong> ${servicesText}</li>
            <li><strong>Address:</strong> ${address}</li>
          </ul>
          <p>We will contact you shortly to confirm the pickup details.</p>
          <hr>
          <p>Best regards,<br>Dresscode Laundry Team</p>
          <p>Phone: ${PHONE_DISPLAY}<br>Email: hellodresscodes@gmail.com</p>
        `,
      })

      console.log("Customer confirmation email sent successfully")
    }

    return NextResponse.json({
      success: true,
      message: "Booking request submitted successfully",
      bookingId,
    })
  } catch (error) {
    console.error("Error processing booking:", error)
    return NextResponse.json({ error: "Failed to process booking request" }, { status: 500 })
  }
}
