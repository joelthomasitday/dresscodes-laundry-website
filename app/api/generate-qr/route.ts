import { NextRequest, NextResponse } from 'next/server'
import { prepareWhatsAppOrder } from '@/lib/upi-qr'

export async function POST(request: NextRequest) {
  try {
    const { customerName, totalAmount, orderId } = await request.json()

    if (!customerName || !totalAmount || !orderId) {
      return NextResponse.json(
        { error: 'Missing required fields: customerName, totalAmount, orderId' },
        { status: 400 }
      )
    }

    const { message, qrFile } = await prepareWhatsAppOrder(customerName, totalAmount, orderId)

    return NextResponse.json({
      success: true,
      message,
      qrFile,
      orderId
    })
  } catch (error) {
    console.error('Error generating QR code:', error)
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    )
  }
}
