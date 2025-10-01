'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import InvoiceBuilder from '@/components/InvoiceBuilder'

// Dummy order data (same as in dashboard)
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

export default function InvoicePage() {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    const foundOrder = dummyOrders.find(o => o.id === id)
    if (foundOrder) {
      setOrder(foundOrder)
    } else {
      router.push('/admin')
    }
  }, [id, isAuthenticated, router])

  if (!isAuthenticated || !order) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-black">
      <InvoiceBuilder order={order} />
    </div>
  )
}
