import QRCode from "qrcode"
import fs from "fs"
import path from "path"

/**
 * Generate UPI QR code for a given amount (client-side)
 * @param amount - The payment amount in INR
 * @returns Promise<string> - Base64 encoded QR code image
 */
export const generateUPIQR = async (amount: number): Promise<string> => {
  // UPI payment link format
  const upiLink = `upi://pay?pa=4dresscode@fbl&pn=Sobin Scaria&am=${amount}&cu=INR&tn=Order from 4dresscode`

  // Generate QR as base64 PNG
  const qrDataUrl = await QRCode.toDataURL(upiLink, {
    width: 250,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  })

  return qrDataUrl
}

/**
 * Generate dynamic UPI QR PNG for a given amount (server-side)
 * @param amount - The payment amount in INR
 * @param orderId - Unique order identifier
 * @returns Promise<string> - Path to the generated PNG file
 */
export const generateUPIPNG = async (amount: number, orderId: string): Promise<string> => {
  try {
    const upiLink = `upi://pay?pa=4dresscode@fbl&pn=Sobin Scaria&am=${amount}&cu=INR&tn=Order from 4dresscode`

    // Generate PNG buffer
    const buffer = await QRCode.toBuffer(upiLink, { width: 250 })

    // Save PNG to public folder
    const qrFileName = `order-${orderId}.png`
    const qrFilePath = path.join(process.cwd(), "public", qrFileName)

    // Ensure the directory exists
    const publicDir = path.join(process.cwd(), "public")
    if (!fs.existsSync(publicDir)) {
      throw new Error(`Public directory does not exist: ${publicDir}`)
    }

    // Write the file
    fs.writeFileSync(qrFilePath, buffer)

    // Verify the file was created
    if (!fs.existsSync(qrFilePath)) {
      throw new Error(`Failed to create QR file: ${qrFilePath}`)
    }

    return `/${qrFileName}` // Public path for client access
  } catch (error) {
    console.error('Error in generateUPIPNG:', error)
    throw new Error(`QR generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Generate WhatsApp message text
 * @param customerName - Customer's name
 * @param totalAmount - Total order amount
 * @returns string - Formatted WhatsApp message
 */
export const generateWhatsAppMessage = (customerName: string, totalAmount: number): string => {
  return `Hi ${customerName}, thank you for your order!

🛍️ Order Total: ₹${totalAmount}

💳 How to pay:
Scan the QR code image attached below using any UPI app (Google Pay / PhonePe / Paytm / BHIM).

Once paid, please reply "PAID" or share a screenshot for confirmation. ✅`
}

/**
 * Full automated function for WhatsApp order preparation
 * @param customerName - Customer's name
 * @param totalAmount - Total order amount
 * @param orderId - Unique order identifier
 * @returns Promise<{message: string, qrFile: string}> - Message and QR file path
 */
export const prepareWhatsAppOrder = async (customerName: string, totalAmount: number, orderId: string) => {
  const qrFile = await generateUPIPNG(totalAmount, orderId)
  const message = generateWhatsAppMessage(customerName, totalAmount)
  return { message, qrFile } // Ready to send on WhatsApp
}
