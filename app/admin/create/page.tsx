'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Minus, ArrowLeft } from 'lucide-react'
import jsPDF from 'jspdf'

interface InvoiceItem {
  name: string
  qty: number
  price: number
  total: number
}

interface ManualInvoice {
  id: string
  invoiceNumber: string
  customerName: string
  phone: string
  email: string
  address: string
  date: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
}

export default function CreateInvoicePage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  })
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0])
  const [items, setItems] = useState<InvoiceItem[]>([
    { name: '', qty: 1, price: 0, total: 0 }
  ])
  const [taxRate, setTaxRate] = useState(5)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
    // Auto-generate invoice number
    const timestamp = Date.now()
    setInvoiceNumber(`INV-${timestamp}`)
  }, [isAuthenticated, router])

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = [...items]
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
      total: field === 'qty' || field === 'price'
        ? (field === 'qty' ? value as number : updatedItems[index].qty) *
          (field === 'price' ? value as number : updatedItems[index].price)
        : updatedItems[index].total
    }
    setItems(updatedItems)
  }

  const addItem = () => {
    setItems([...items, { name: '', qty: 1, price: 0, total: 0 }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }

  const calculateTax = () => {
    return (calculateSubtotal() * taxRate) / 100
  }

  const calculateGrandTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  const handleSubmit = () => {
    // Validate required fields
    if (!customer.name || !customer.phone || !invoiceNumber) {
      alert('Please fill in all required fields')
      return
    }

    const newInvoice: ManualInvoice = {
      id: Date.now().toString(),
      invoiceNumber,
      customerName: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      date: invoiceDate,
      items,
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      total: calculateGrandTotal()
    }

    // Save to localStorage
    const existing = localStorage.getItem('manualInvoices')
    const invoices = existing ? JSON.parse(existing) : []
    invoices.push(newInvoice)
    localStorage.setItem('manualInvoices', JSON.stringify(invoices))

    router.push('/admin')
  }

  const handleGeneratePDF = () => {
    const pdf = new jsPDF()

    // Set up document
    pdf.setFontSize(20)
    pdf.text('Dresscode Laundry - Invoice', 20, 30)

    pdf.setFontSize(12)
    pdf.text(`Invoice #: ${invoiceNumber}`, 20, 50)
    pdf.text(`Date: ${invoiceDate}`, 20, 60)

    // Customer details
    pdf.text('Customer Details:', 20, 80)
    pdf.text(`Name: ${customer.name}`, 20, 90)
    pdf.text(`Phone: ${customer.phone}`, 20, 100)
    if (customer.email) pdf.text(`Email: ${customer.email}`, 20, 110)
    if (customer.address) pdf.text(`Address: ${customer.address}`, 20, 120)

    // Items table
    let yPos = 140
    pdf.text('Items:', 20, yPos)
    yPos += 10

    // Table header
    pdf.setFontSize(10)
    pdf.text('Item', 20, yPos)
    pdf.text('Qty', 100, yPos)
    pdf.text('Price', 130, yPos)
    pdf.text('Total', 160, yPos)
    yPos += 5
    pdf.line(20, yPos, 190, yPos)
    yPos += 10

    // Items
    items.forEach(item => {
      if (item.name) {
        pdf.text(item.name, 20, yPos)
        pdf.text(item.qty.toString(), 100, yPos)
        pdf.text(`₹${item.price}`, 130, yPos)
        pdf.text(`₹${item.total}`, 160, yPos)
        yPos += 10
      }
    })

    yPos += 10
    pdf.line(20, yPos, 190, yPos)
    yPos += 10

    // Totals
    pdf.text(`Subtotal: ₹${calculateSubtotal()}`, 130, yPos)
    yPos += 10
    pdf.text(`Tax (${taxRate}%): ₹${calculateTax().toFixed(2)}`, 130, yPos)
    yPos += 10
    pdf.text(`Grand Total: ₹${calculateGrandTotal().toFixed(2)}`, 130, yPos + 5)

    pdf.save(`invoice-${invoiceNumber}.pdf`)
  }

  if (!isAuthenticated) {
    return <div>Redirecting to login...</div>
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => router.push('/admin')}
            variant="outline"
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Button>
          <Button
            onClick={handleGeneratePDF}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Generate PDF Preview
          </Button>
        </div>

        <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
          <CardHeader>
            <CardTitle className="text-white">Create Manual Invoice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Invoice Details */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Invoice Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoiceNumber" className="text-white">Invoice Number</Label>
                  <Input
                    id="invoiceNumber"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="bg-[#2a2a2a] border-[#3a3a3a] text-white"
                    placeholder="INV-001"
                  />
                </div>
                <div>
                  <Label htmlFor="invoiceDate" className="text-white">Invoice Date</Label>
                  <Input
                    id="invoiceDate"
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="bg-[#2a2a2a] border-[#3a3a3a] text-white"
                  />
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Customer Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName" className="text-white">Customer Name *</Label>
                  <Input
                    id="customerName"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    className="bg-[#2a2a2a] border-[#3a3a3a] text-white"
                    placeholder="Enter customer name"
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone" className="text-white">Phone Number *</Label>
                  <Input
                    id="customerPhone"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="bg-[#2a2a2a] border-[#3a3a3a] text-white"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail" className="text-white">Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="bg-[#2a2a2a] border-[#3a3a3a] text-white"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="customerAddress" className="text-white">Address</Label>
                  <Input
                    id="customerAddress"
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="bg-[#2a2a2a] border-[#3a3a3a] text-white"
                    placeholder="Enter address"
                  />
                </div>
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Items</h3>
              <div className="rounded-md border border-[#2a2a2a]">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#2a2a2a]">
                      <TableHead className="text-white">Item Name</TableHead>
                      <TableHead className="text-white">Quantity</TableHead>
                      <TableHead className="text-white">Price (₹)</TableHead>
                      <TableHead className="text-white">Total (₹)</TableHead>
                      <TableHead className="text-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={index} className="border-[#2a2a2a]">
                        <TableCell>
                          <Input
                            value={item.name}
                            onChange={(e) => updateItem(index, 'name', e.target.value)}
                            className="bg-[#2a2a2a] border-[#3a3a3a] text-white"
                            placeholder="Item name"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) => updateItem(index, 'qty', parseInt(e.target.value) || 1)}
                            className="bg-[#2a2a2a] border-[#3a3a3a] text-white w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.price}
                            onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                            className="bg-[#2a2a2a] border-[#3a3a3a] text-white w-24"
                          />
                        </TableCell>
                        <TableCell className="text-white">
                          ₹{item.total.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => removeItem(index)}
                            variant="outline"
                            size="sm"
                            className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                            disabled={items.length === 1}
                          >
                            <Minus size={14} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Button
                onClick={addItem}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus size={14} className="mr-2" />
                Add Item
              </Button>
            </div>

            {/* Calculations */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="taxRate" className="text-white">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  className="bg-[#2a2a2a] border-[#3a3a3a] text-white"
                />
              </div>
              <div className="flex items-center">
                <Label className="text-white">Subtotal: ₹{calculateSubtotal().toFixed(2)}</Label>
              </div>
              <div className="flex items-center">
                <Label className="text-white">Tax: ₹{calculateTax().toFixed(2)}</Label>
              </div>
              <div className="flex items-center">
                <Label className="text-green-400 font-semibold">Grand Total: ₹{calculateGrandTotal().toFixed(2)}</Label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-8"
              >
                Save Invoice
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
