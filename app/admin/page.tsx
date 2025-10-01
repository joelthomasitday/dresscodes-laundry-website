'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Trash2 } from 'lucide-react'
import jsPDF from 'jspdf'

// Dummy order data
const dummyOrders = [
  {
    id: 'ORD-001',
    customerName: 'John Doe',
    phone: '+91 9876543210',
    email: 'john@example.com',
    pickupDate: '2025-10-01',
    deliveryDate: '2025-10-02',
    status: 'Pending',
    totalAmount: 850,
    items: [
      { service: 'Wash & Fold', weight: '2kg', price: 400 },
      { service: 'Dry Cleaning', item: 'Shirt', quantity: 2, price: 450 }
    ]
  },
  {
    id: 'ORD-002',
    customerName: 'Jane Smith',
    phone: '+91 9876543211',
    email: 'jane@example.com',
    pickupDate: '2025-09-30',
    deliveryDate: '2025-10-01',
    status: 'Ready',
    totalAmount: 1200,
    items: [
      { service: 'Wash & Fold', weight: '3kg', price: 600 },
      { service: 'Ironing', item: 'Pant', quantity: 3, price: 600 }
    ]
  },
  {
    id: 'ORD-003',
    customerName: 'Mike Johnson',
    phone: '+91 9876543212',
    email: 'mike@example.com',
    pickupDate: '2025-09-29',
    deliveryDate: '2025-09-30',
    status: 'Completed',
    totalAmount: 650,
    items: [
      { service: 'Dry Cleaning', item: 'Suit', quantity: 1, price: 650 }
    ]
  }
]

export default function AdminDashboard() {
  const { isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [orders] = useState(dummyOrders)
  const [manualInvoices, setManualInvoices] = useState<any[]>([])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
    // Load manual invoices from localStorage
    const saved = localStorage.getItem('manualInvoices')
    if (saved) {
      setManualInvoices(JSON.parse(saved))
    }
  }, [isAuthenticated, router])

  const handleDownloadPDF = (invoice: any) => {
    const pdf = new jsPDF()

    // Set up document
    pdf.setFontSize(20)
    pdf.text('Dresscode Laundry - Invoice', 20, 30)

    pdf.setFontSize(12)
    pdf.text(`Invoice #: ${invoice.invoiceNumber}`, 20, 50)
    pdf.text(`Date: ${invoice.date}`, 20, 60)

    // Customer details
    pdf.text('Customer Details:', 20, 80)
    pdf.text(`Name: ${invoice.customerName}`, 20, 90)
    pdf.text(`Phone: ${invoice.phone}`, 20, 100)
    if (invoice.email) pdf.text(`Email: ${invoice.email}`, 20, 110)
    if (invoice.address) pdf.text(`Address: ${invoice.address}`, 20, 120)

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
    invoice.items.forEach((item: any) => {
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
    pdf.text(`Subtotal: ₹${invoice.subtotal}`, 130, yPos)
    yPos += 10
    pdf.text(`Tax (${((invoice.tax / invoice.subtotal) * 100).toFixed(1)}%): ₹${invoice.tax.toFixed(2)}`, 130, yPos)
    yPos += 10
    pdf.text(`Grand Total: ₹${invoice.total}`, 130, yPos + 5)

    pdf.save(`invoice-${invoice.invoiceNumber}.pdf`)
  }

  const handleDeleteInvoice = (invoiceId: string) => {
    const updatedInvoices = manualInvoices.filter(invoice => invoice.id !== invoiceId)
    setManualInvoices(updatedInvoices)
    localStorage.setItem('manualInvoices', JSON.stringify(updatedInvoices))
  }

  if (!isAuthenticated) {
    return <div>Redirecting to login...</div>
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-[#2a2a2a] px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
          <h1 className="text-lg sm:text-xl font-semibold text-green-400">Admin Dashboard</h1>
          <div className="flex flex-col space-y-2 sm:flex-row sm:gap-2 sm:space-y-0">
            <Button
              onClick={() => router.push('/admin/create')}
              className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto rounded-lg"
              size="sm"
            >
              <Plus size={16} className="mr-2" />
              Create Invoice
            </Button>
            <Button
              onClick={logout}
              variant="outline"
              className="bg-red-600 hover:bg-red-700 text-white border-red-600 w-full sm:w-auto rounded-lg"
              size="sm"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="p-4 sm:p-6 space-y-6">
        <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
          <CardHeader>
            <CardTitle className="text-white">Orders Overview</CardTitle>
            <CardDescription className="text-gray-400">
              Manage your laundry service orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-[#2a2a2a] overflow-x-auto">
              <Table className="min-w-[800px]">
                <TableHeader>
                  <TableRow className="border-[#2a2a2a]">
                    <TableHead className="text-white min-w-[100px]">Order ID</TableHead>
                    <TableHead className="text-white min-w-[120px]">Customer</TableHead>
                    <TableHead className="text-white min-w-[140px]">Phone</TableHead>
                    <TableHead className="text-white min-w-[100px]">Status</TableHead>
                    <TableHead className="text-white min-w-[80px]">Total</TableHead>
                    <TableHead className="text-white min-w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="border-[#2a2a2a]">
                      <TableCell className="text-white font-medium">{order.id}</TableCell>
                      <TableCell className="text-white">{order.customerName}</TableCell>
                      <TableCell className="text-white">{order.phone}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'Ready'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-white">₹{order.totalAmount}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => router.push(`/admin/invoice/${order.id}`)}
                          className="bg-green-600 hover:bg-green-700 text-white rounded-lg"
                          size="sm"
                        >
                          Create Invoice
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Manual Invoices */}
        {manualInvoices.length > 0 && (
          <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
            <CardHeader>
              <CardTitle className="text-white">Manual Invoices</CardTitle>
              <CardDescription className="text-gray-400">
                Invoices created manually
              </CardDescription>
            </CardHeader>
            <CardContent>
            <div className="rounded-md border border-[#2a2a2a] overflow-x-auto">
                <Table className="min-w-[700px]">
                  <TableHeader>
                    <TableRow className="border-[#2a2a2a]">
                      <TableHead className="text-white min-w-[120px]">Invoice Number</TableHead>
                      <TableHead className="text-white min-w-[140px]">Customer Name</TableHead>
                      <TableHead className="text-white min-w-[100px]">Date</TableHead>
                      <TableHead className="text-white min-w-[80px]">Total</TableHead>
                      <TableHead className="text-white min-w-[180px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {manualInvoices.map((invoice) => (
                      <TableRow key={invoice.id} className="border-[#2a2a2a]">
                        <TableCell className="text-white font-medium">{invoice.invoiceNumber}</TableCell>
                        <TableCell className="text-white">{invoice.customerName}</TableCell>
                        <TableCell className="text-white">{invoice.date}</TableCell>
                        <TableCell className="text-white">₹{invoice.total}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleDownloadPDF(invoice)}
                              className="bg-green-600 hover:bg-green-700 text-white rounded-lg"
                              size="sm"
                            >
                              Download PDF
                            </Button>
                            <Button
                              onClick={() => handleDeleteInvoice(invoice.id)}
                              variant="outline"
                              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg"
                              size="sm"
                            >
                              <Trash2 size={16} className="mr-1" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
