"use client"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { useState } from "react"

const pricingData = {
  "Men's Clothing": [
    { SNo: 1, Item: "Shirt", "Clean Craft (₹)": 100 },
    { SNo: 2, Item: "Shirt Silk", "Clean Craft (₹)": 130 },
    { SNo: 3, Item: "Shirt Woolen", "Clean Craft (₹)": 130 },
    { SNo: 4, Item: "T Shirt", "Clean Craft (₹)": 90 },
    { SNo: 5, Item: "Pant", "Clean Craft (₹)": 110 },
    { SNo: 6, Item: "Jeans", "Clean Craft (₹)": 125 },
    { SNo: 7, Item: "Coat", "Clean Craft (₹)": 300 },
    { SNo: 8, Item: "Waist Coat", "Clean Craft (₹)": 140 },
    { SNo: 9, Item: "Long Coat", "Clean Craft (₹)": 410 },
    { SNo: 10, Item: "Jacket Full Sleeves", "Clean Craft (₹)": 300 },
    { SNo: 11, Item: "Jacket Half Sleeves", "Clean Craft (₹)": 230 },
    { SNo: 12, Item: "Jacket with Hood", "Clean Craft (₹)": 375 },
    { SNo: 13, Item: "Leather Jacket", "Clean Craft (₹)": 430 },
    { SNo: 14, Item: "Sweater", "Clean Craft (₹)": 160 },
    { SNo: 15, Item: "Long Pullover", "Clean Craft (₹)": 130 },
    { SNo: 16, Item: "Kurta", "Clean Craft (₹)": 125 },
    { SNo: 17, Item: "Kurta Heavy", "Clean Craft (₹)": 170 },
    { SNo: 18, Item: "Dhoti", "Clean Craft (₹)": 120 },
    { SNo: 19, Item: "Safari Suit Coat", "Clean Craft (₹)": 210 },
    { SNo: 20, Item: "Safari Suit Pant", "Clean Craft (₹)": 125 },
    { SNo: 21, Item: "Achkan", "Clean Craft (₹)": 400 },
    { SNo: 22, Item: "Shorts", "Clean Craft (₹)": 90 },
    { SNo: 23, Item: "Pyjama", "Clean Craft (₹)": 90 },
    { SNo: 24, Item: "Capri", "Clean Craft (₹)": 90 },
    { SNo: 25, Item: "Sweat Pants", "Clean Craft (₹)": 120 },
    { SNo: 26, Item: "Track Pant", "Clean Craft (₹)": 120 },
    { SNo: 27, Item: "Swimming Costume", "Clean Craft (₹)": 45 },
    { SNo: 28, Item: "Under Wear", "Clean Craft (₹)": 45 },
    { SNo: 29, Item: "Vest", "Clean Craft (₹)": 45 },
  ],
  "Women's Clothing": [
    { SNo: 1, Item: "Kurta Plain", "Clean Craft (₹)": 125 },
    { SNo: 2, Item: "Kurta Very Heavy", "Clean Craft (₹)": 270 },
    { SNo: 3, Item: "Plazo Plain", "Clean Craft (₹)": 90 },
    { SNo: 4, Item: "Plazo Heavy", "Clean Craft (₹)": 150 },
    { SNo: 5, Item: "Dupatta", "Clean Craft (₹)": 75 },
    { SNo: 6, Item: "Dupatta Heavy", "Clean Craft (₹)": 100 },
    { SNo: 7, Item: "Saree Plain", "Clean Craft (₹)": 160 },
    { SNo: 8, Item: "Saree Heavy", "Clean Craft (₹)": 250 },
    { SNo: 9, Item: "Saree Very Heavy", "Clean Craft (₹)": 325 },
    { SNo: 10, Item: "Petticoat", "Clean Craft (₹)": 65 },
    { SNo: 11, Item: "Blouse", "Clean Craft (₹)": 65 },
    { SNo: 12, Item: "Blouse Heavy", "Clean Craft (₹)": 95 },
    { SNo: 13, Item: "Dress Plain", "Clean Craft (₹)": 280 },
    { SNo: 14, Item: "Dress Very Heavy", "Clean Craft (₹)": 440 },
    { SNo: 15, Item: "Dress Long Plain", "Clean Craft (₹)": 380 },
    { SNo: 16, Item: "Dress Long Very Heavy", "Clean Craft (₹)": 580 },
    { SNo: 17, Item: "Lehnga Plain", "Clean Craft (₹)": 430 },
    { SNo: 18, Item: "Lehnga Heavy", "Clean Craft (₹)": 555 },
    { SNo: 19, Item: "Lehnga Very Heavy", "Clean Craft (₹)": 700 },
    { SNo: 20, Item: "Skirt Short Plain", "Clean Craft (₹)": 190 },
    { SNo: 21, Item: "Skirt Short Heavy", "Clean Craft (₹)": 280 },
    { SNo: 22, Item: "Skirt Long Plain", "Clean Craft (₹)": 265 },
    { SNo: 23, Item: "Skirt Long Heavy", "Clean Craft (₹)": 300 },
    { SNo: 24, Item: "Top Plain", "Clean Craft (₹)": 125 },
    { SNo: 25, Item: "Top Heavy", "Clean Craft (₹)": 185 },
    { SNo: 26, Item: "Top Woollen", "Clean Craft (₹)": 180 },
    { SNo: 27, Item: "Shirt", "Clean Craft (₹)": 100 },
    { SNo: 28, Item: "T Shirt", "Clean Craft (₹)": 90 },
    { SNo: 29, Item: "Pants", "Clean Craft (₹)": 110 },
    { SNo: 30, Item: "Jeans", "Clean Craft (₹)": 125 },
    { SNo: 31, Item: "Jumper", "Clean Craft (₹)": 180 },
    { SNo: 32, Item: "Dangree", "Clean Craft (₹)": 180 },
    { SNo: 33, Item: "Legging", "Clean Craft (₹)": 90 },
    { SNo: 34, Item: "Capri", "Clean Craft (₹)": 90 },
    { SNo: 35, Item: "Slacks", "Clean Craft (₹)": 98 },
    { SNo: 36, Item: "Stole Plain", "Clean Craft (₹)": 75 },
    { SNo: 37, Item: "Stole Heavy", "Clean Craft (₹)": 100 },
    { SNo: 38, Item: "Shawl Plain", "Clean Craft (₹)": 130 },
    { SNo: 39, Item: "Shawl Heavy", "Clean Craft (₹)": 170 },
    { SNo: 40, Item: "Scarf", "Clean Craft (₹)": 60 },
    { SNo: 41, Item: "Coat", "Clean Craft (₹)": 300 },
    { SNo: 42, Item: "Long Coat", "Clean Craft (₹)": 440 },
    { SNo: 43, Item: "Jacket Full Sleeves", "Clean Craft (₹)": 300 },
    { SNo: 44, Item: "Jacket Half Sleeves", "Clean Craft (₹)": 220 },
    { SNo: 45, Item: "Jacket with Hood", "Clean Craft (₹)": 370 },
    { SNo: 46, Item: "Sweat Shirt with Hood", "Clean Craft (₹)": 190 },
    { SNo: 47, Item: "Sweater Full Sleeves Plain", "Clean Craft (₹)": 130 },
    { SNo: 48, Item: "Sweater Full Sleeves Heavy", "Clean Craft (₹)": 160 },
    { SNo: 49, Item: "Sweater Half Sleeves Plain", "Clean Craft (₹)": 90 },
    { SNo: 50, Item: "Sweater Half Sleeves Heavy", "Clean Craft (₹)": 125 },
    { SNo: 51, Item: "Long Pullover", "Clean Craft (₹)": 190 },
    { SNo: 52, Item: "Stocking", "Clean Craft (₹)": 90 },
    { SNo: 53, Item: "Track Pant", "Clean Craft (₹)": 120 },
  ],
  "Kids' Clothing": [
    { SNo: 1, Item: "Shirt", "Clean Craft (₹)": 80 },
    { SNo: 2, Item: "Shirt Woolen", "Clean Craft (₹)": 100 },
    { SNo: 3, Item: "T Shirt", "Clean Craft (₹)": 70 },
    { SNo: 4, Item: "Top Plain", "Clean Craft (₹)": 90 },
    { SNo: 5, Item: "Top Heavy", "Clean Craft (₹)": 140 },
    { SNo: 6, Item: "Pants", "Clean Craft (₹)": 90 },
    { SNo: 7, Item: "Jeans", "Clean Craft (₹)": 90 },
    { SNo: 8, Item: "Capri", "Clean Craft (₹)": 70 },
    { SNo: 9, Item: "Shorts", "Clean Craft (₹)": 70 },
    { SNo: 10, Item: "Jumper", "Clean Craft (₹)": 140 },
    { SNo: 11, Item: "Dangree", "Clean Craft (₹)": 140 },
    { SNo: 12, Item: "Frock Plain", "Clean Craft (₹)": 170 },
    { SNo: 13, Item: "Frock Heavy", "Clean Craft (₹)": 220 },
    { SNo: 14, Item: "Frock Very Heavy", "Clean Craft (₹)": 270 },
    { SNo: 15, Item: "Skirt Plain", "Clean Craft (₹)": 240 },
    { SNo: 16, Item: "Baby Blanket", "Clean Craft (₹)": 270 },
    { SNo: 17, Item: "Skirt Heavy", "Clean Craft (₹)": 290 },
    { SNo: 18, Item: "Skirt Very Heavy", "Clean Craft (₹)": 380 },
    { SNo: 19, Item: "Dress Plain", "Clean Craft (₹)": 220 },
    { SNo: 20, Item: "Dress Very Heavy", "Clean Craft (₹)": 360 },
    { SNo: 21, Item: "Sherwani", "Clean Craft (₹)": 350 },
    { SNo: 22, Item: "Kurta Plain", "Clean Craft (₹)": 90 },
    { SNo: 23, Item: "Kurta Very Heavy", "Clean Craft (₹)": 215 },
    { SNo: 24, Item: "Salwar Plain", "Clean Craft (₹)": 70 },
    { SNo: 25, Item: "Salwar Heavy", "Clean Craft (₹)": 120 },
    { SNo: 26, Item: "Dupatta", "Clean Craft (₹)": 50 },
    { SNo: 27, Item: "Dupatta Very Heavy", "Clean Craft (₹)": 130 },
    { SNo: 28, Item: "Blouse", "Clean Craft (₹)": 50 },
    { SNo: 29, Item: "Blouse Heavy", "Clean Craft (₹)": 70 },
    { SNo: 30, Item: "Lehnga Plain", "Clean Craft (₹)": 350 },
    { SNo: 31, Item: "Lehnga Heavy", "Clean Craft (₹)": 460 },
    { SNo: 32, Item: "Coat", "Clean Craft (₹)": 235 },
    { SNo: 33, Item: "Waist Coat", "Clean Craft (₹)": 100 },
    { SNo: 34, Item: "Long Coat", "Clean Craft (₹)": 380 },
    { SNo: 35, Item: "Long Pullover", "Clean Craft (₹)": 150 },
    { SNo: 36, Item: "Jacket Full Sleeves", "Clean Craft (₹)": 230 },
    { SNo: 37, Item: "Jacket Half Sleeves", "Clean Craft (₹)": 180 },
    { SNo: 38, Item: "Jacket with Hood", "Clean Craft (₹)": 290 },
    { SNo: 39, Item: "Sweater Full Sleeves Plain", "Clean Craft (₹)": 100 },
    { SNo: 40, Item: "Sweater Full Sleeves Heavy", "Clean Craft (₹)": 130 },
    { SNo: 41, Item: "Sweater Half Sleeves Plain", "Clean Craft (₹)": 70 },
    { SNo: 42, Item: "Sweater Half Sleeves Heavy", "Clean Craft (₹)": 90 },
    { SNo: 43, Item: "Sweat Shirt", "Clean Craft (₹)": 130 },
    { SNo: 44, Item: "Sweat Shirt with Hood", "Clean Craft (₹)": 150 },
    { SNo: 45, Item: "Swimming Costume", "Clean Craft (₹)": 30 },
    { SNo: 46, Item: "Legging", "Clean Craft (₹)": 70 },
    { SNo: 47, Item: "Track Pant", "Clean Craft (₹)": 90 },
    { SNo: 48, Item: "Baby Blanket", "Clean Craft (₹)": 270 },
  ],
  "Other Items": [
    { SNo: 1, Item: "Soft Toy Small", "Clean Craft (₹)": 220 },
    { SNo: 2, Item: "Soft Toy Medium", "Clean Craft (₹)": 360 },
    { SNo: 3, Item: "Soft Toy Large", "Clean Craft (₹)": 490 },
    { SNo: 4, Item: "Soft Toy Extra Large", "Clean Craft (₹)": 600 },
    { SNo: 5, Item: "Soft Toy Full Size", "Clean Craft (₹)": 800 },
    { SNo: 6, Item: "Suit Case Small", "Clean Craft (₹)": 270 },
    { SNo: 7, Item: "Suit Case Medium", "Clean Craft (₹)": 410 },
    { SNo: 8, Item: "Suit Case Large", "Clean Craft (₹)": 560 },
    { SNo: 9, Item: "Suit Case Extra Large", "Clean Craft (₹)": 700 },
    { SNo: 10, Item: "Handbag Canvass Jute Cloth based Large", "Clean Craft (₹)": 400 },
    { SNo: 11, Item: "Handbag Canvass Jute Cloth based Small", "Clean Craft (₹)": 300 },
    { SNo: 12, Item: "Handbag Leather Small", "Clean Craft (₹)": 430 },
    { SNo: 13, Item: "Handbag Leather Large", "Clean Craft (₹)": 630 },
    { SNo: 14, Item: "Handkerchief", "Clean Craft (₹)": 40 },
    { SNo: 15, Item: "Hat", "Clean Craft (₹)": 170 },
    { SNo: 16, Item: "Cap", "Clean Craft (₹)": 170 },
    { SNo: 17, Item: "Muffler", "Clean Craft (₹)": 100 },
    { SNo: 18, Item: "Rain Coat", "Clean Craft (₹)": 220 },
    { SNo: 19, Item: "Tie", "Clean Craft (₹)": 40 },
    { SNo: 20, Item: "Bath Robe", "Clean Craft (₹)": 160 },
    { SNo: 21, Item: "Belt", "Clean Craft (₹)": 220 },
    { SNo: 22, Item: "Wallet", "Clean Craft (₹)": 220 },
    { SNo: 23, Item: "Car Seat Cover", "Clean Craft (₹)": 190 },
    { SNo: 24, Item: "Gloves", "Clean Craft (₹)": 60 },
    { SNo: 25, Item: "Socks", "Clean Craft (₹)": 60 },
    { SNo: 26, Item: "Face Mask", "Clean Craft (₹)": 50 },
    { SNo: 27, Item: "Seat Cover", "Clean Craft (₹)": 50 },
  ],
  "Household Items": [
    { SNo: 1, Item: "Curtain Door", "Clean Craft (₹)": 170 },
    { SNo: 2, Item: "Curtain Door With Lining", "Clean Craft (₹)": 280 },
    { SNo: 3, Item: "Curtain Window", "Clean Craft (₹)": 130 },
    { SNo: 4, Item: "Curtain Window With Lining", "Clean Craft (₹)": 230 },
    { SNo: 5, Item: "Curtain Belt", "Clean Craft (₹)": 50 },
    { SNo: 6, Item: "Blind Door", "Clean Craft (₹)": 280 },
    { SNo: 7, Item: "Blind Window", "Clean Craft (₹)": 220 },
    { SNo: 8, Item: "Blanket Single", "Clean Craft (₹)": 335 },
    { SNo: 9, Item: "Blanket Single 2 Ply", "Clean Craft (₹)": 420 },
    { SNo: 10, Item: "Blanket Double", "Clean Craft (₹)": 435 },
    { SNo: 11, Item: "Blanket Double 2 Ply", "Clean Craft (₹)": 535 },
    { SNo: 12, Item: "Quilt Single", "Clean Craft (₹)": 420 },
    { SNo: 13, Item: "Quilt Double", "Clean Craft (₹)": 535 },
    { SNo: 14, Item: "Quilt Cover Single", "Clean Craft (₹)": 240 },
    { SNo: 15, Item: "Quilt Cover Double", "Clean Craft (₹)": 290 },
    { SNo: 16, Item: "Duvet", "Clean Craft (₹)": 80 },
    { SNo: 17, Item: "Duvet Double", "Clean Craft (₹)": 125 },
    { SNo: 18, Item: "Bed Sheet Single", "Clean Craft (₹)": 135 },
    { SNo: 19, Item: "Bed Sheet Double", "Clean Craft (₹)": 165 },
    { SNo: 20, Item: "Bed Spread Single", "Clean Craft (₹)": 240 },
    { SNo: 21, Item: "Bed Spread Double", "Clean Craft (₹)": 290 },
    { SNo: 22, Item: "Sofa Cover Small", "Clean Craft (₹)": 50 },
    { SNo: 23, Item: "Sofa Cover Medium", "Clean Craft (₹)": 100 },
    { SNo: 24, Item: "Sofa Cover Large", "Clean Craft (₹)": 150 },
    { SNo: 25, Item: "Cushion Covers", "Clean Craft (₹)": 50 },
    { SNo: 26, Item: "Cushion Covers Medium", "Clean Craft (₹)": 100 },
    { SNo: 27, Item: "Cushion Covers Large", "Clean Craft (₹)": 150 },
    { SNo: 28, Item: "Cushion Small", "Clean Craft (₹)": 130 },
    { SNo: 29, Item: "Cushion Medium", "Clean Craft (₹)": 190 },
    { SNo: 30, Item: "Cushion Large", "Clean Craft (₹)": 250 },
    { SNo: 31, Item: "Pillow Covers", "Clean Craft (₹)": 50 },
    { SNo: 32, Item: "Chair Covers", "Clean Craft (₹)": 50 },
    { SNo: 33, Item: "Hand Towel", "Clean Craft (₹)": 40 },
    { SNo: 34, Item: "Towel Large", "Clean Craft (₹)": 130 },
    { SNo: 35, Item: "Carpet", "Clean Craft (₹)": 40 },
    { SNo: 36, Item: "Table Cloth Small", "Clean Craft (₹)": 70 },
    { SNo: 37, Item: "Table Cloth Large", "Clean Craft (₹)": 130 },
    { SNo: 38, Item: "Table Mat", "Clean Craft (₹)": 50 },
    { SNo: 39, Item: "Foot Mats", "Clean Craft (₹)": 60 },
    { SNo: 40, Item: "Mattress Double", "Clean Craft (₹)": 2000 },
    { SNo: 41, Item: "Bed Head", "Clean Craft (₹)": 1500 },
    { SNo: 42, Item: "Mattress Single", "Clean Craft (₹)": 1000 },
  ],
  "Shoes": [
    { SNo: 1, Item: "Sport Shoes (Pair)", "Clean Craft (₹)": 310 },
    { SNo: 2, Item: "Canvass Shoes (Pair)", "Clean Craft (₹)": 310 },
    { SNo: 3, Item: "Leather Shoes (Pair)", "Clean Craft (₹)": 520 },
    { SNo: 4, Item: "Suede Leather Shoes", "Clean Craft (₹)": 610 },
    { SNo: 5, Item: "Ankle Length Boots", "Clean Craft (₹)": 740 },
    { SNo: 6, Item: "Mid Length Boots", "Clean Craft (₹)": 1000 },
    { SNo: 7, Item: "Knee Length Boots", "Clean Craft (₹)": 1400 },
    { SNo: 8, Item: "Sandals (Pair)", "Clean Craft (₹)": 300 },
    { SNo: 9, Item: "Slippers (Pair)", "Clean Craft (₹)": 230 },
    { SNo: 10, Item: "Helmet", "Clean Craft (₹)": 300 },
  ],
}

export default function PricingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [selectedService, setSelectedService] = useState<string>("Dry Clean")

  const categories = Object.keys(pricingData)
  const allItems = Object.values(pricingData).flat()

  const getFilteredItems = () => {
    if (selectedCategory === "All") {
      return allItems
    }
    return pricingData[selectedCategory as keyof typeof pricingData] || []
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navigation />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Complete Price List
              </h1>
              <p className="text-xl md:text-2xl text-emerald-100 max-w-3xl mx-auto">
                Transparent pricing for all our laundry and dry cleaning services
              </p>
            </div>
          </div>
        </section>


        {/* Category Filter */}
        <section className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Button
                onClick={() => setSelectedCategory("All")}
                variant={selectedCategory === "All" ? "default" : "outline"}
                className={`!rounded-full ${selectedCategory === "All" ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
              >
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`!rounded-full ${selectedCategory === category ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Pricing Table */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-emerald-50">
                      <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-900">S.No</TableHead>
                      <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Item</TableHead>
                      <TableHead className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Clean Craft (₹)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredItems().map((item, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="px-6 py-4 text-sm font-medium text-gray-900">{item.SNo}</TableCell>
                        <TableCell className="px-6 py-4 text-sm text-gray-900">{item.Item}</TableCell>
                        <TableCell className="px-6 py-4 text-sm text-center text-gray-900">{item["Clean Craft (₹)"]}</TableCell>
                      </TableRow>
                    ))}
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
                <Link href="/booking">Schedule Pickup</Link>
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
    </div>
  )
}
