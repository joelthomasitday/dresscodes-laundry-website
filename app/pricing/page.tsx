"use client"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, X, Plus, Minus, ShoppingCart, MessageCircle, User, MapPin, Phone, CalendarIcon, Clock, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { getWhatsAppHref } from "@/lib/phone"
import { DatePicker } from "@/components/ui/date-picker"

interface CartItem {
  id: string
  item: string
  price: number
  quantity: number
  category: string
}

const pricingData = {
  "Men's Clothing": [
    { SNo: 1, Item: "Shirt", "Price": 100 },
    { SNo: 2, Item: "Shirt Silk", "Price": 130 },
    { SNo: 3, Item: "Shirt Woolen", "Price": 130 },
    { SNo: 4, Item: "T Shirt", "Price": 90 },
    { SNo: 5, Item: "Pant", "Price": 110 },
    { SNo: 6, Item: "Jeans", "Price": 125 },
    { SNo: 7, Item: "Coat", "Price": 300 },
    { SNo: 8, Item: "Waist Coat", "Price": 140 },
    { SNo: 9, Item: "Long Coat", "Price": 410 },
    { SNo: 10, Item: "Jacket Full Sleeves", "Price": 300 },
    { SNo: 11, Item: "Jacket Half Sleeves", "Price": 230 },
    { SNo: 12, Item: "Jacket with Hood", "Price": 375 },
    { SNo: 13, Item: "Leather Jacket", "Price": 430 },
    { SNo: 14, Item: "Sweater", "Price": 160 },
    { SNo: 15, Item: "Long Pullover", "Price": 130 },
    { SNo: 16, Item: "Kurta", "Price": 125 },
    { SNo: 17, Item: "Kurta Heavy", "Price": 170 },
    { SNo: 18, Item: "Dhoti", "Price": 120 },
    { SNo: 19, Item: "Safari Suit Coat", "Price": 210 },
    { SNo: 20, Item: "Safari Suit Pant", "Price": 125 },
    { SNo: 21, Item: "Achkan", "Price": 400 },
    { SNo: 22, Item: "Shorts", "Price": 90 },
    { SNo: 23, Item: "Pyjama", "Price": 90 },
    { SNo: 24, Item: "Capri", "Price": 90 },
    { SNo: 25, Item: "Sweat Pants", "Price": 120 },
    { SNo: 26, Item: "Track Pant", "Price": 120 },
    { SNo: 27, Item: "Swimming Costume", "Price": 45 },
    { SNo: 28, Item: "Under Wear", "Price": 45 },
    { SNo: 29, Item: "Vest", "Price": 45 },
  ],
  "Women's Clothing": [
    { SNo: 30, Item: "Kurta Plain", "Price": 125 },
    { SNo: 31, Item: "Kurta Very Heavy", "Price": 270 },
    { SNo: 32, Item: "Plazo Plain", "Price": 90 },
    { SNo: 33, Item: "Plazo Heavy", "Price": 150 },
    { SNo: 34, Item: "Dupatta", "Price": 75 },
    { SNo: 35, Item: "Dupatta Heavy", "Price": 100 },
    { SNo: 36, Item: "Saree Plain", "Price": 160 },
    { SNo: 37, Item: "Saree Heavy", "Price": 250 },
    { SNo: 38, Item: "Saree Very Heavy", "Price": 325 },
    { SNo: 39, Item: "Petticoat", "Price": 65 },
    { SNo: 40, Item: "Blouse", "Price": 65 },
    { SNo: 41, Item: "Blouse Heavy", "Price": 95 },
    { SNo: 42, Item: "Dress Plain", "Price": 280 },
    { SNo: 43, Item: "Dress Very Heavy", "Price": 440 },
    { SNo: 44, Item: "Dress Long Plain", "Price": 380 },
    { SNo: 45, Item: "Dress Long Very Heavy", "Price": 580 },
    { SNo: 46, Item: "Lehnga Plain", "Price": 430 },
    { SNo: 47, Item: "Lehnga Heavy", "Price": 555 },
    { SNo: 48, Item: "Lehnga Very Heavy", "Price": 700 },
    { SNo: 49, Item: "Skirt Short Plain", "Price": 190 },
    { SNo: 50, Item: "Skirt Short Heavy", "Price": 280 },
    { SNo: 51, Item: "Skirt Long Plain", "Price": 265 },
    { SNo: 52, Item: "Skirt Long Heavy", "Price": 300 },
    { SNo: 53, Item: "Top Plain", "Price": 125 },
    { SNo: 54, Item: "Top Heavy", "Price": 185 },
    { SNo: 55, Item: "Top Woollen", "Price": 180 },
    { SNo: 56, Item: "Shirt", "Price": 100 },
    { SNo: 57, Item: "T Shirt", "Price": 90 },
    { SNo: 58, Item: "Pants", "Price": 110 },
    { SNo: 59, Item: "Jeans", "Price": 125 },
    { SNo: 60, Item: "Jumper", "Price": 180 },
    { SNo: 61, Item: "Dangree", "Price": 180 },
    { SNo: 62, Item: "Legging", "Price": 90 },
    { SNo: 63, Item: "Capri", "Price": 90 },
    { SNo: 64, Item: "Slacks", "Price": 98 },
    { SNo: 65, Item: "Stole Plain", "Price": 75 },
    { SNo: 66, Item: "Stole Heavy", "Price": 100 },
    { SNo: 67, Item: "Shawl Plain", "Price": 130 },
    { SNo: 68, Item: "Shawl Heavy", "Price": 170 },
    { SNo: 69, Item: "Scarf", "Price": 60 },
    { SNo: 70, Item: "Coat", "Price": 300 },
    { SNo: 71, Item: "Long Coat", "Price": 440 },
    { SNo: 72, Item: "Jacket Full Sleeves", "Price": 300 },
    { SNo: 73, Item: "Jacket Half Sleeves", "Price": 220 },
    { SNo: 74, Item: "Jacket with Hood", "Price": 370 },
    { SNo: 75, Item: "Sweat Shirt with Hood", "Price": 190 },
    { SNo: 76, Item: "Sweater Full Sleeves Plain", "Price": 130 },
    { SNo: 77, Item: "Sweater Full Sleeves Heavy", "Price": 160 },
    { SNo: 78, Item: "Sweater Half Sleeves Plain", "Price": 90 },
    { SNo: 79, Item: "Sweater Half Sleeves Heavy", "Price": 125 },
    { SNo: 80, Item: "Long Pullover", "Price": 190 },
    { SNo: 81, Item: "Stocking", "Price": 90 },
    { SNo: 82, Item: "Track Pant", "Price": 120 },
  ],
  "Kids' Clothing": [
    { SNo: 83, Item: "Shirt", "Price": 80 },
    { SNo: 84, Item: "Shirt Woolen", "Price": 100 },
    { SNo: 85, Item: "T Shirt", "Price": 70 },
    { SNo: 86, Item: "Top Plain", "Price": 90 },
    { SNo: 87, Item: "Top Heavy", "Price": 140 },
    { SNo: 88, Item: "Pants", "Price": 90 },
    { SNo: 89, Item: "Jeans", "Price": 90 },
    { SNo: 90, Item: "Capri", "Price": 70 },
    { SNo: 91, Item: "Shorts", "Price": 70 },
    { SNo: 92, Item: "Jumper", "Price": 140 },
    { SNo: 93, Item: "Dangree", "Price": 140 },
    { SNo: 94, Item: "Frock Plain", "Price": 170 },
    { SNo: 95, Item: "Frock Heavy", "Price": 220 },
    { SNo: 96, Item: "Frock Very Heavy", "Price": 270 },
    { SNo: 97, Item: "Skirt Plain", "Price": 240 },
    { SNo: 98, Item: "Baby Blanket", "Price": 270 },
    { SNo: 99, Item: "Skirt Heavy", "Price": 290 },
    { SNo: 100, Item: "Skirt Very Heavy", "Price": 380 },
    { SNo: 101, Item: "Dress Plain", "Price": 220 },
    { SNo: 102, Item: "Dress Very Heavy", "Price": 360 },
    { SNo: 103, Item: "Sherwani", "Price": 350 },
    { SNo: 104, Item: "Kurta Plain", "Price": 90 },
    { SNo: 105, Item: "Kurta Very Heavy", "Price": 215 },
    { SNo: 106, Item: "Salwar Plain", "Price": 70 },
    { SNo: 107, Item: "Salwar Heavy", "Price": 120 },
    { SNo: 108, Item: "Dupatta", "Price": 50 },
    { SNo: 109, Item: "Dupatta Very Heavy", "Price": 130 },
    { SNo: 110, Item: "Blouse", "Price": 50 },
    { SNo: 111, Item: "Blouse Heavy", "Price": 70 },
    { SNo: 112, Item: "Lehnga Plain", "Price": 350 },
    { SNo: 113, Item: "Lehnga Heavy", "Price": 460 },
    { SNo: 114, Item: "Coat", "Price": 235 },
    { SNo: 115, Item: "Waist Coat", "Price": 100 },
    { SNo: 116, Item: "Long Coat", "Price": 380 },
    { SNo: 117, Item: "Long Pullover", "Price": 150 },
    { SNo: 118, Item: "Jacket Full Sleeves", "Price": 230 },
    { SNo: 119, Item: "Jacket Half Sleeves", "Price": 180 },
    { SNo: 120, Item: "Jacket with Hood", "Price": 290 },
    { SNo: 121, Item: "Sweater Full Sleeves Plain", "Price": 100 },
    { SNo: 122, Item: "Sweater Full Sleeves Heavy", "Price": 130 },
    { SNo: 123, Item: "Sweater Half Sleeves Plain", "Price": 70 },
    { SNo: 124, Item: "Sweater Half Sleeves Heavy", "Price": 90 },
    { SNo: 125, Item: "Sweat Shirt", "Price": 130 },
    { SNo: 126, Item: "Sweat Shirt with Hood", "Price": 150 },
    { SNo: 127, Item: "Swimming Costume", "Price": 30 },
    { SNo: 128, Item: "Legging", "Price": 70 },
    { SNo: 129, Item: "Track Pant", "Price": 90 },
    { SNo: 130, Item: "Baby Blanket", "Price": 270 },
  ],
  "Other Items": [
    { SNo: 131, Item: "Soft Toy Small", "Price": 220 },
    { SNo: 132, Item: "Soft Toy Medium", "Price": 360 },
    { SNo: 133, Item: "Soft Toy Large", "Price": 490 },
    { SNo: 134, Item: "Soft Toy Extra Large", "Price": 600 },
    { SNo: 135, Item: "Soft Toy Full Size", "Price": 800 },
    { SNo: 136, Item: "Suit Case Small", "Price": 270 },
    { SNo: 137, Item: "Suit Case Medium", "Price": 410 },
    { SNo: 138, Item: "Suit Case Large", "Price": 560 },
    { SNo: 139, Item: "Suit Case Extra Large", "Price": 700 },
    { SNo: 140, Item: "Handbag Canvass Jute Cloth based Large", "Price": 400 },
    { SNo: 141, Item: "Handbag Canvass Jute Cloth based Small", "Price": 300 },
    { SNo: 142, Item: "Handbag Leather Small", "Price": 430 },
    { SNo: 143, Item: "Handbag Leather Large", "Price": 630 },
    { SNo: 144, Item: "Handkerchief", "Price": 40 },
    { SNo: 145, Item: "Hat", "Price": 170 },
    { SNo: 146, Item: "Cap", "Price": 170 },
    { SNo: 147, Item: "Muffler", "Price": 100 },
    { SNo: 148, Item: "Rain Coat", "Price": 220 },
    { SNo: 149, Item: "Tie", "Price": 40 },
    { SNo: 150, Item: "Bath Robe", "Price": 160 },
    { SNo: 151, Item: "Belt", "Price": 220 },
    { SNo: 152, Item: "Wallet", "Price": 220 },
    { SNo: 153, Item: "Car Seat Cover", "Price": 190 },
    { SNo: 154, Item: "Gloves", "Price": 60 },
    { SNo: 155, Item: "Socks", "Price": 60 },
    { SNo: 156, Item: "Face Mask", "Price": 50 },
    { SNo: 157, Item: "Seat Cover", "Price": 50 },
  ],
  "Household Items": [
    { SNo: 158, Item: "Curtain Door", "Price": 170 },
    { SNo: 159, Item: "Curtain Door With Lining", "Price": 280 },
    { SNo: 160, Item: "Curtain Window", "Price": 130 },
    { SNo: 161, Item: "Curtain Window With Lining", "Price": 230 },
    { SNo: 162, Item: "Curtain Belt", "Price": 50 },
    { SNo: 163, Item: "Blind Door", "Price": 280 },
    { SNo: 164, Item: "Blind Window", "Price": 220 },
    { SNo: 165, Item: "Blanket Single", "Price": 335 },
    { SNo: 166, Item: "Blanket Single 2 Ply", "Price": 420 },
    { SNo: 167, Item: "Blanket Double", "Price": 435 },
    { SNo: 168, Item: "Blanket Double 2 Ply", "Price": 535 },
    { SNo: 169, Item: "Quilt Single", "Price": 420 },
    { SNo: 170, Item: "Quilt Double", "Price": 535 },
    { SNo: 171, Item: "Quilt Cover Single", "Price": 240 },
    { SNo: 172, Item: "Quilt Cover Double", "Price": 290 },
    { SNo: 173, Item: "Duvet", "Price": 80 },
    { SNo: 174, Item: "Duvet Double", "Price": 125 },
    { SNo: 175, Item: "Bed Sheet Single", "Price": 135 },
    { SNo: 176, Item: "Bed Sheet Double", "Price": 165 },
    { SNo: 177, Item: "Bed Spread Single", "Price": 240 },
    { SNo: 178, Item: "Bed Spread Double", "Price": 290 },
    { SNo: 179, Item: "Sofa Cover Small", "Price": 50 },
    { SNo: 180, Item: "Sofa Cover Medium", "Price": 100 },
    { SNo: 181, Item: "Sofa Cover Large", "Price": 150 },
    { SNo: 182, Item: "Cushion Covers", "Price": 50 },
    { SNo: 183, Item: "Cushion Covers Medium", "Price": 100 },
    { SNo: 184, Item: "Cushion Covers Large", "Price": 150 },
    { SNo: 185, Item: "Cushion Small", "Price": 130 },
    { SNo: 186, Item: "Cushion Medium", "Price": 190 },
    { SNo: 187, Item: "Cushion Large", "Price": 250 },
    { SNo: 188, Item: "Pillow Covers", "Price": 50 },
    { SNo: 189, Item: "Chair Covers", "Price": 50 },
    { SNo: 190, Item: "Hand Towel", "Price": 40 },
    { SNo: 191, Item: "Towel Large", "Price": 130 },
    { SNo: 192, Item: "Carpet", "Price": 40 },
    { SNo: 193, Item: "Table Cloth Small", "Price": 70 },
    { SNo: 194, Item: "Table Cloth Large", "Price": 130 },
    { SNo: 195, Item: "Table Mat", "Price": 50 },
    { SNo: 196, Item: "Foot Mats", "Price": 60 },
    { SNo: 197, Item: "Mattress Double", "Price": 2000 },
    { SNo: 198, Item: "Bed Head", "Price": 1500 },
    { SNo: 199, Item: "Mattress Single", "Price": 1000 },
  ],
  "Shoes": [
    { SNo: 200, Item: "Sport Shoes (Pair)", "Price": 310 },
    { SNo: 201, Item: "Canvass Shoes (Pair)", "Price": 310 },
    { SNo: 202, Item: "Leather Shoes (Pair)", "Price": 520 },
    { SNo: 203, Item: "Suede Leather Shoes", "Price": 610 },
    { SNo: 204, Item: "Ankle Length Boots", "Price": 740 },
    { SNo: 205, Item: "Mid Length Boots", "Price": 1000 },
    { SNo: 206, Item: "Knee Length Boots", "Price": 1400 },
    { SNo: 207, Item: "Sandals (Pair)", "Price": 300 },
    { SNo: 208, Item: "Slippers (Pair)", "Price": 230 },
    { SNo: 209, Item: "Helmet", "Price": 300 },
  ],
}

export default function PricingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [selectedService, setSelectedService] = useState<string>("Dry Clean")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState<boolean>(false)
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    pickupDate: undefined as Date | undefined,
    timeSlot: "",
    useCurrentLocation: false
  })
  const [customerErrors, setCustomerErrors] = useState<Record<string, string>>({})
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false)
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false)
  const [locationCoords, setLocationCoords] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null })
  const { toast } = useToast()

  const categories = Object.keys(pricingData)
  const allItems = Object.values(pricingData).flat()

  // Format number with commas for better readability
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-IN')
  }

  const getFilteredItems = () => {
    // Always search across all items when there's a search query
    let items = searchQuery.trim() ? allItems : (selectedCategory === "All" ? allItems : pricingData[selectedCategory as keyof typeof pricingData] || [])

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      items = items.filter(item =>
        item.Item.toLowerCase().includes(query)
      )
    }

    return items
  }

  // Cart helper functions
  const addToCart = (item: any, category: string) => {
    const cartItem: CartItem = {
      id: `${category}-${item.Item}-${Date.now()}`,
      item: item.Item,
      price: item["Price"],
      quantity: 1,
      category
    }

    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.item === item.Item && cartItem.category === category)
      if (existingItem) {
        // Update existing item quantity
        const updatedCart = prev.map(cartItem =>
          cartItem.item === item.Item && cartItem.category === category
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )

        // Show quantity update notification after state update
        setTimeout(() => {
          toast({
            title: "Quantity Updated",
            description: `${item.Item} (${existingItem.quantity + 1}) has been updated in your cart`,
            duration: 3000,
          })
        }, 0)

        return updatedCart
      } else {
        // Add new item to cart
        const newCart = [...prev, cartItem]

        // Show new item notification after state update
        setTimeout(() => {
          toast({
            title: "Added to Cart",
            description: `${item.Item} (1) has been added to your cart`,
            duration: 3000,
          })
        }, 0)

        return newCart
      }
    })
  }

  const proceedToCheckout = () => {
    if (cart.length === 0) return
    setIsCustomerModalOpen(true)
  }

  const sendToWhatsApp = async () => {
    if (cart.length === 0) return

    try {
      // Generate WhatsApp message with bill and UPI details
      const groupedItems = cart.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = []
        }
        acc[item.category].push(item)
        return acc
      }, {} as Record<string, CartItem[]>)

      const totalItems = getTotalItems()
      const totalPrice = getTotalPrice()

      let message = `*Your Order Summary from Dresscode Laundry*

`

      // Add items grouped by category
      Object.entries(groupedItems).forEach(([category, items]) => {
        message += `*${category}*
`
        items.forEach((item, index) => {
          message += `${index + 1}. ${item.item} - ₹${formatPrice(item.price)} x ${item.quantity} = ₹${formatPrice(item.price * item.quantity)}
`
        })
        message += `
`
      })

      message += `*Order Summary:*
• Total Items: ${totalItems}
• Total Amount: ₹${formatPrice(totalPrice)}

*Payment Details:*
• UPI ID: dresscode@upi
• Account Holder: Dresscode Laundry Services
• Bank: HDFC Bank
*Thank you for choosing Dresscode Laundry!*`

      const whatsappUrl = getWhatsAppHref(message)
      window.open(whatsappUrl, '_blank')

      toast({
        title: "Order Sent",
        description: "Your order with payment details has been sent to WhatsApp!",
        duration: 3000,
      })
    } catch (error: unknown) {
      console.error("Error sending order:", error)

      // Simple error handling for WhatsApp
      let errorMessage = "Failed to send order to WhatsApp. Please try again."

      if (error instanceof Error) {
        errorMessage = error.message
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, quantity } : item
    ))
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const validateCustomerInfo = () => {
    const errors: Record<string, string> = {}

    if (!customerInfo.name.trim()) {
      errors.name = "Name is required"
    }

    if (!customerInfo.phone.trim()) {
      errors.phone = "Phone number is required"
    } else if (!/^[0-9]{10}$/.test(customerInfo.phone.replace(/[-\s]/g, ""))) {
      errors.phone = "Please enter a valid 10-digit phone number"
    }

    // Address is only required if not using current location
    if (!customerInfo.address.trim() && !customerInfo.useCurrentLocation) {
      errors.address = "Address is required"
    }

    if (!customerInfo.pickupDate) {
      errors.pickupDate = "Please select a pickup date"
    }

    if (!customerInfo.timeSlot) {
      errors.timeSlot = "Please select a time slot"
    }

    setCustomerErrors(errors)
    return Object.keys(errors).length === 0
  }

  const generateWhatsAppMessage = (name: string, phone: string, address: string, pickupDate: Date, timeSlot: string) => {
    const groupedItems = cart.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    }, {} as Record<string, CartItem[]>)

    const totalItems = getTotalItems()
    const totalPrice = getTotalPrice()

    // Determine address to use in message
    const displayAddress = customerInfo.useCurrentLocation && locationCoords.lat && locationCoords.lng
      ? `${address}
Location: https://www.google.com/maps?q=${locationCoords.lat},${locationCoords.lng}`
      : address

    let message = `*Your Order Summary from Dresscode Laundry*

*Customer Details:*
• Name: ${name}
• Phone: ${phone}
• Address: ${displayAddress}
• Pickup Date: ${pickupDate.toLocaleDateString()}
• Time Slot: ${timeSlot}

*Order Items:*
`

    // Add items grouped by category
    Object.entries(groupedItems).forEach(([category, items]) => {
      message += `*${category}*
`
      items.forEach((item, index) => {
        message += `${index + 1}. ${item.item} - ₹${formatPrice(item.price)} x ${item.quantity} = ₹${formatPrice(item.price * item.quantity)}
`
      })
      message += `
`
    })

    message += `*Order Summary:*
• Total Items: ${totalItems}
• Total Amount: ₹${formatPrice(totalPrice)}

*Payment Details:*
• UPI ID: dresscode@upi
• Account Holder: Dresscode Laundry Services
• Bank: HDFC Bank

*Pickup Schedule:*
• Date: ${pickupDate.toLocaleDateString()}
• Time: ${timeSlot}

*Thank you for choosing Dresscode Laundry!*`

    return message
  }

  const handleLocationCheckbox = (checked: boolean) => {
    setCustomerInfo(prev => ({ ...prev, useCurrentLocation: checked }))

    if (checked) {
      setIsLoadingLocation(true)

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocationCoords({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            })
            setIsLoadingLocation(false)
            toast({
              title: "Location Captured",
              description: "Your location will be shared via Google Maps link",
              duration: 3000,
            })
          },
          (error) => {
            setIsLoadingLocation(false)
            setCustomerInfo(prev => ({ ...prev, useCurrentLocation: false }))
            toast({
              title: "Location Error",
              description: "Unable to get location. Please enter address manually.",
              variant: "destructive",
              duration: 4000,
            })
          }
        )
      } else {
        setIsLoadingLocation(false)
        toast({
          title: "Not Supported",
          description: "Geolocation is not supported by your browser",
          variant: "destructive",
          duration: 4000,
        })
      }
    }
  }

  const handleCustomerInfoSubmit = () => {
    if (validateCustomerInfo() && customerInfo.pickupDate) {
      const message = generateWhatsAppMessage(
        customerInfo.name,
        customerInfo.phone,
        customerInfo.address,
        customerInfo.pickupDate,
        customerInfo.timeSlot
      )
      const whatsappUrl = getWhatsAppHref(message)
      window.open(whatsappUrl, '_blank')

      toast({
        title: "Order Sent",
        description: "Your order with customer details has been sent to WhatsApp!",
        duration: 3000,
      })

      // Reset form and close modal
      setCustomerInfo({
        name: "",
        phone: "",
        address: "",
        pickupDate: undefined,
        timeSlot: "",
        useCurrentLocation: false
      })
      setCustomerErrors({})
      setIsCustomerModalOpen(false)
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navigation />

      <main className="pt-20">
        {/* Hero Section - Mobile Optimized */}
        <section className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
                Complete Price List
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-emerald-100 max-w-3xl mx-auto px-4">
                Transparent pricing for all our laundry and dry cleaning services
              </p>
            </div>
          </div>
        </section>

        {/* Cart Summary - Moved to top for better visibility */}
        {cart.length > 0 && (
          <section className="py-4 sm:py-8 bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Card className="shadow-lg">
                <CardHeader className="bg-emerald-50 px-4 sm:px-6 py-4">
                  <CardTitle className="flex items-center gap-2 text-emerald-800 text-lg sm:text-xl">
                    <ShoppingCart className="h-5 w-5" />
                    Cart Summary ({getTotalItems()} items)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  {/* Group items by category */}
                  {Object.entries(
                    cart.reduce((acc, item) => {
                      if (!acc[item.category]) {
                        acc[item.category] = []
                      }
                      acc[item.category].push(item)
                      return acc
                    }, {} as Record<string, CartItem[]>)
                  ).map(([category, items]) => (
                    <div key={category} className="mb-6 last:mb-0">
                      <h3 className="font-semibold text-emerald-800 text-sm sm:text-base mb-3 pb-2 border-b border-emerald-200">
                        {category}
                      </h3>
                      <div className="space-y-3 sm:space-y-4">
                        {items.map((cartItem) => (
                          <div key={cartItem.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3 sm:gap-0">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-sm sm:text-base">{cartItem.item}</h4>
                              <p className="text-xs sm:text-sm text-emerald-600 font-medium">₹{formatPrice(cartItem.price)} each</p>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-3">
                              <div className="flex items-center gap-2">
                                <Button
                                  onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 p-0 rounded-full"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center font-medium text-sm">{cartItem.quantity}</span>
                                <Button
                                  onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 p-0 rounded-full"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="text-right min-w-[80px]">
                                <p className="font-medium text-gray-900 text-sm sm:text-base">₹{formatPrice(cartItem.price * cartItem.quantity)}</p>
                              </div>
                              <Button
                                onClick={() => removeFromCart(cartItem.id)}
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0 rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4">
                      <span className="text-base sm:text-lg font-semibold text-gray-900">Total:</span>
                      <span className="text-lg sm:text-xl font-bold text-emerald-600">₹{formatPrice(getTotalPrice())}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={proceedToCheckout}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 sm:px-6 py-3 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                        Proceed to WhatsApp
                      </Button>
                      <Button
                        onClick={() => setCart([])}
                        variant="outline"
                        className="px-4 sm:px-6 py-3 rounded-full text-base sm:text-lg font-semibold transition-all duration-300"
                      >
                        Clear Cart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}



        {/* Category Filter & Search - Mobile Optimized */}
        <section className="py-6 sm:py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search Input - Mobile First */}
            <div className="mb-6 sm:mb-8">
              <div className="relative max-w-md mx-auto">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 sm:py-4 text-sm sm:text-base bg-white border border-gray-200 rounded-full shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 hover:border-gray-300 hover:shadow-md placeholder-gray-400"
                  />

                  {/* Search Icon */}
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 pointer-events-none">
                    <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200" />
                  </div>

                  {/* Clear Search Button */}
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Category Filter - Mobile Optimized */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                <Button
                  onClick={() => setSelectedCategory("All")}
                  variant={selectedCategory === "All" ? "default" : "outline"}
                  className={`!rounded-full text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 ${selectedCategory === "All" ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                >
                  All Categories
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={`!rounded-full text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 whitespace-nowrap ${selectedCategory === category ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Pricing Table - Mobile Responsive */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Mobile Card Layout */}
              <div className="block sm:hidden">
                {getFilteredItems().length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m6 5H3a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-lg font-medium text-gray-900 mb-1">No items found</p>
                      <p className="text-sm text-gray-500">
                        {searchQuery ? `No items match "${searchQuery}"` : "No items in this category"}
                      </p>
                      {searchQuery && (
                        <Button
                          onClick={() => setSearchQuery("")}
                          variant="outline"
                          size="sm"
                          className="mt-3"
                        >
                          Clear Search
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {getFilteredItems().map((item, index) => (
                      <div key={index} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                #{item.SNo}
                              </span>
                              <h3 className="text-base font-medium text-gray-900 truncate">{item.Item}</h3>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-emerald-600">₹{formatPrice(item["Price"])}</span>
                              <Button
                                onClick={() => addToCart(item, selectedCategory)}
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1"
                              >
                                <Plus className="h-3 w-3" />
                                Add
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden sm:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-emerald-50">
                      <TableHead className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">S.No</TableHead>
                      <TableHead className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">Item</TableHead>
                      <TableHead className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold text-gray-900">Price</TableHead>
                      <TableHead className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold text-gray-900">Add to Cart</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredItems().length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-500">
                            <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m6 5H3a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-lg font-medium text-gray-900 mb-1">No items found</p>
                            <p className="text-sm text-gray-500">
                              {searchQuery ? `No items match "${searchQuery}"` : "No items in this category"}
                            </p>
                            {searchQuery && (
                              <Button
                                onClick={() => setSearchQuery("")}
                                variant="outline"
                                size="sm"
                                className="mt-3"
                              >
                                Clear Search
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      getFilteredItems().map((item, index) => (
                        <TableRow key={index} className="hover:bg-gray-50">
                          <TableCell className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">{item.SNo}</TableCell>
                          <TableCell className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">{item.Item}</TableCell>
                          <TableCell className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-center text-gray-900 font-medium">{formatPrice(item["Price"])}</TableCell>
                          <TableCell className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                            <Button
                              onClick={() => addToCart(item, selectedCategory)}
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-full text-xs font-medium transition-all duration-200"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl md:text-2xl text-emerald-100 mb-8 max-w-3xl mx-auto">
              Book your laundry pickup today and experience our premium services at these transparent prices
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300"
              >
                <Link href="/pricing">Schedule Pickup</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Customer Information Modal - Full Screen on Mobile */}
      <Dialog open={isCustomerModalOpen} onOpenChange={setIsCustomerModalOpen}>
        <DialogContent className="sm:max-w-md max-w-[95vw] h-[90vh] sm:h-auto overflow-y-auto">
          <DialogHeader className="space-y-3">
            <DialogTitle className="flex items-center gap-2 text-emerald-700">
              <User className="h-5 w-5" />
              Customer Information
            </DialogTitle>
            <p className="text-sm text-gray-600">
              Please provide your details to proceed with the WhatsApp order.
            </p>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-5">
              <div>
                <Label htmlFor="customerName" className="text-sm font-medium text-gray-700">Full Name *</Label>
                <Input
                  id="customerName"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  className={`mt-1 rounded-full ${customerErrors.name ? "border-red-500" : ""}`}
                />
                {customerErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{customerErrors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="customerPhone" className="text-sm font-medium text-gray-700">Phone Number *</Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter your 10-digit phone number"
                  className={`mt-1 rounded-full ${customerErrors.phone ? "border-red-500" : ""}`}
                />
                {customerErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">{customerErrors.phone}</p>
                )}
              </div>

              <div>
                <Label htmlFor="customerAddress" className="text-sm font-medium text-gray-700">Pickup Address *</Label>
                <Textarea
                  id="customerAddress"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter your complete pickup address"
                  rows={3}
                  className={`mt-1 rounded-lg ${customerErrors.address ? "border-red-500" : ""}`}
                />
                {customerErrors.address && (
                  <p className="text-red-500 text-sm mt-1">{customerErrors.address}</p>
                )}
              </div>

              {/* Location Checkbox */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="useCurrentLocation"
                    checked={customerInfo.useCurrentLocation}
                    onCheckedChange={handleLocationCheckbox}
                    className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                  />
                  <Label
                    htmlFor="useCurrentLocation"
                    className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4" />
                    Use my current location
                    {isLoadingLocation && <Loader2 className="h-4 w-4 animate-spin" />}
                  </Label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DatePicker
                  date={customerInfo.pickupDate}
                  onDateChange={(date) => {
                    setCustomerInfo(prev => ({ ...prev, pickupDate: date }));
                    if (customerErrors.pickupDate) {
                      setCustomerErrors(prev => ({ ...prev, pickupDate: "" }));
                    }
                  }}
                  placeholder="Select date"
                  error={!!customerErrors.pickupDate}
                  errorMessage={customerErrors.pickupDate}
                  label="Pickup Date *"
                />

                <div>
                  <Label htmlFor="timeSlot" className="text-sm font-medium text-gray-700">Time Slot *</Label>
                  <Select
                    value={customerInfo.timeSlot}
                    onValueChange={(value) => {
                      setCustomerInfo(prev => ({ ...prev, timeSlot: value }));
                      if (customerErrors.timeSlot) {
                        setCustomerErrors(prev => ({ ...prev, timeSlot: "" }));
                      }
                    }}
                  >
                    <SelectTrigger className={`mt-1 rounded-full ${customerErrors.timeSlot ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9:00 AM - 11:00 AM">9:00 AM - 11:00 AM</SelectItem>
                      <SelectItem value="11:00 AM - 1:00 PM">11:00 AM - 1:00 PM</SelectItem>
                      <SelectItem value="1:00 PM - 3:00 PM">1:00 PM - 3:00 PM</SelectItem>
                      <SelectItem value="3:00 PM - 5:00 PM">3:00 PM - 5:00 PM</SelectItem>
                      <SelectItem value="5:00 PM - 7:00 PM">5:00 PM - 7:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                  {customerErrors.timeSlot && (
                    <p className="text-red-500 text-sm mt-1">{customerErrors.timeSlot}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t">
              <Button
                onClick={() => setIsCustomerModalOpen(false)}
                variant="outline"
                className="flex-1 rounded-full"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCustomerInfoSubmit}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 rounded-full"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Send to WhatsApp
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
