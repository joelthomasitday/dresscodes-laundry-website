'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowLeft, Download } from 'lucide-react'
import jsPDF from 'jspdf'

interface OrderItem {
  service?: string
  weight?: string
  item?: string
  quantity?: number
  price: number
}

interface Order {
  id: string
  customerName: string
  phone: string
  email: string
  pickupDate: string
  deliveryDate: string
  status: string
  totalAmount: number
  items: OrderItem[]
}

interface InvoiceBuilderProps {
  order: Order
}

export default function InvoiceBuilder({ order }: InvoiceBuilderProps) {
  const router = useRouter()
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: `INV-${order.id}`,
    date: new Date().toISOString().split('T')[0],
    customerName: order.customerName,
    customerPhone: order.phone,
    customerEmail: order.email,
    items: order.items,
    taxRate: 18, // GST in India
    discount: 0,
    notes: 'Thank you for choosing Dresscode Laundry!'
  })

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((sum, item) => sum + item.price, 0)
  }

  const calculateTax = () => {
    return (calculateSubtotal() - invoiceData.discount) * (invoiceData.taxRate / 100)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - invoiceData.discount
  }

  const handleDownloadPDF = () => {
    const pdf = new jsPDF()

    // Set up colors and fonts
    const primaryColor = '#0d9488' // green
    const textColor = '#000000'
    pdf.setTextColor(textColor)

    // Header
    pdf.setFontSize(20)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Dresscode Laundry', 20, 30)

    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    pdf.text('PROFESSIONAL DRY CLEANING & LAUNDRY SERVICES', 20, 40)
    pdf.text('Kottayam, Kerala, India', 20, 50)

    // Invoice details
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('INVOICE', 160, 30)

    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Invoice #: ${invoiceData.invoiceNumber}`, 140, 45)
    pdf.text(`Date: ${invoiceData.date}`, 140, 55)

    // Customer details
    pdf.setFont('helvetica', 'bold')
    pdf.text('Bill To:', 20, 70)
    pdf.setFont('helvetica', 'normal')
    pdf.text(invoiceData.customerName, 20, 80)
    pdf.text(`Phone: ${invoiceData.customerPhone}`, 20, 90)
    pdf.text(`Email: ${invoiceData.customerEmail}`, 20, 100)

    // Table header
    let yPosition = 120
    pdf.setFont('helvetica', 'bold')
    pdf.setFillColor(200, 200, 200)
    pdf.rect(20, yPosition - 5, 170, 10, 'F')
    pdf.setTextColor(textColor)
    pdf.text('Service/Item', 25, yPosition)
    pdf.text('Details', 80, yPosition)
    pdf.text('Price (₹)', 150, yPosition)

    // Table items
    yPosition += 15
    pdf.setFont('helvetica', 'normal')
    invoiceData.items.forEach(item => {
      let description = ''
      if (item.service === 'Wash & Fold') {
        description = `${item.service} (${item.weight})`
      } else if (item.item) {
        description = `${item.service || 'Service'} (${item.item}${item.quantity ? ` x${item.quantity}` : ''})`
      } else {
        description = item.service || 'Service'
      }

      pdf.text(description, 25, yPosition)
      pdf.text(`₹${item.price}`, 150, yPosition, { align: 'right' })
      yPosition += 10
    })

    // Totals
    yPosition += 10
    pdf.setFont('helvetica', 'bold')
    pdf.text(`Subtotal: ₹${calculateSubtotal()}`, 140, yPosition)
    yPosition += 10
    pdf.text(`Tax (${invoiceData.taxRate}%): ₹${calculateTax().toFixed(2)}`, 140, yPosition)
    yPosition += 10
    if (invoiceData.discount > 0) {
      pdf.text(`Discount: -₹${invoiceData.discount}`, 140, yPosition)
      yPosition += 10
    }
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text(`Total: ₹${calculateTotal().toFixed(2)}`, 140, yPosition + 5)

    // Notes
    yPosition += 30
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text('Notes:', 20, yPosition)
    pdf.text(invoiceData.notes, 20, yPosition + 10)

    // Footer
    yPosition += 40
    pdf.text('Thank you for your business!', 75, yPosition)

    // Download
    pdf.save(`invoice-${invoiceData.invoiceNumber}.pdf`)
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl md:text-3xl font-bold tracking-wide">Invoice Builder</h1>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => router.push('/admin')}
              variant="outline"
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Button>
            <Button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <Download size={16} />
              Download PDF
            </Button>
          </div>
        </div>
        <p className="text-gray-400 text-sm">Generate professional invoices for laundry services with detailed breakdowns</p>
      </div>

      {/* Invoice Form */}
      <div className="max-w-6xl mx-auto">
        <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
          <CardHeader>
            <CardTitle className="text-white">Invoice Builder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Invoice Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invoiceNumber" className="text-white">Invoice Number</Label>
                <Input
                  id="invoiceNumber"
                  value={invoiceData.invoiceNumber}
                  onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
                  className="bg-[#2a2a2a] border-[#3a3a3a] text-white"
                />
              </div>
              <div>
                <Label htmlFor="date" className="text-white">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={invoiceData.date}
                  onChange={(e) => setInvoiceData({ ...invoiceData, date: e.target.value })}
                  className="bg-[#2a2a2a] border-[#3a3a3a] text-white"
                />
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="customerName" className="text-white">Customer Name</Label>
                <Input
                  id="customerName"
                  value={invoiceData.customerName}
                  onChange={(e) => setInvoiceData({ ...invoiceData, customerName: e.target.value })}
                  className="bg-[#2a2a2a] border-[#3a3a3a] text-white"
                />
              </div>
              <div>
                <Label htmlFor="customerPhone" className="text-white">Phone</Label>
                <Input
                  id="customerPhone"
                  value={invoiceData.customerPhone}
                  onChange={(e) => setInvoiceData({ ...invoiceData, customerPhone: e.target.value })}
                  className="bg-[#2a2a2a] border-[#3a3a3a] text-white"
                />
              </div>
              <div>
                <Label htmlFor="customerEmail" className="text-white">Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={invoiceData.customerEmail}
                  onChange={(e) => setInvoiceData({ ...invoiceData, customerEmail: e.target.value })}
                  className="bg-[#2a2a2a] border-[#3a3a3a] text-white"
                />
              </div>
            </div>

            {/* Items Table */}
            <div>
              <div className="rounded-md border border-[#2a2a2a]">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#2a2a2a]">
                      <TableHead className="text-white">Service/Item</TableHead>
                      <TableHead className="text-white">Details</TableHead>
                      <TableHead className="text-white">Price (₹)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoiceData.items.map((item, index) => (
                      <TableRow key={index} className="border-[#2a2a2a]">
                        <TableCell className="text-white">
                          {item.service || item.item}
                        </TableCell>
                        <TableCell className="text-white">
                          {item.service === 'Wash & Fold' ? item.weight :
                           item.item ? `${item.item}${item.quantity ? ` x${item.quantity}` : ''}` : ''}
                        </TableCell>
                        <TableCell className="text-white">₹{item.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Calculations */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="taxRate" className="text-white">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={invoiceData.taxRate}
                  onChange={(e) => setInvoiceData({ ...invoiceData, taxRate: Number(e.target.value) })}
                  className="bg-[#2a2a2a] border-[#3a3a3a] text-white"
                />
              </div>
              <div>
                <Label htmlFor="discount" className="text-white">Discount (₹)</Label>
                <Input
                  id="discount"
                  type="number"
                  value={invoiceData.discount}
                  onChange={(e) => setInvoiceData({ ...invoiceData, discount: Number(e.target.value) })}
                  className="bg-[#2a2a2a] border-[#3a3a3a] text-white"
                />
              </div>
              <div>
                <Label className="text-white">Subtotal</Label>
                <div className="mt-1 p-2 bg-[#2a2a2a] rounded border border-[#3a3a3a] text-white">
                  ₹{calculateSubtotal()}
                </div>
              </div>
              <div>
                <Label className="text-white">Total</Label>
                <div className="mt-1 p-2 bg-[#2a2a2a] rounded border border-[#3a3a3a] text-green-400 font-bold">
                  ₹{calculateTotal().toFixed(2)}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes" className="text-white">Notes</Label>
              <Textarea
                id="notes"
                value={invoiceData.notes}
                onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
                className="bg-[#2a2a2a] border-[#3a3a3a] text-white"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
