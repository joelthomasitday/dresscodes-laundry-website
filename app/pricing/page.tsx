"use client"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { useState } from "react"

const pricingData = {
  "Men's Clothing": [
    { SNo: 1, Item: "Shirt", "Tumble Dry (₹)": 110, "Clean Craft (₹)": 100 },
    { SNo: 2, Item: "Shirt Silk", "Tumble Dry (₹)": 150, "Clean Craft (₹)": 130 },
    { SNo: 3, Item: "Shirt Woolen", "Tumble Dry (₹)": 150, "Clean Craft (₹)": 130 },
    { SNo: 4, Item: "T Shirt", "Tumble Dry (₹)": 100, "Clean Craft (₹)": 90 },
    { SNo: 5, Item: "Pant", "Tumble Dry (₹)": 130, "Clean Craft (₹)": 110 },
    { SNo: 6, Item: "Jeans", "Tumble Dry (₹)": 130, "Clean Craft (₹)": 125 },
    { SNo: 7, Item: "Coat", "Tumble Dry (₹)": 310, "Clean Craft (₹)": 300 },
    { SNo: 8, Item: "Waist Coat", "Tumble Dry (₹)": 150, "Clean Craft (₹)": 140 },
    { SNo: 9, Item: "Long Coat", "Tumble Dry (₹)": 460, "Clean Craft (₹)": 410 },
    { SNo: 10, Item: "Jacket Full Sleeves", "Tumble Dry (₹)": 310, "Clean Craft (₹)": 300 },
    { SNo: 11, Item: "Jacket Half Sleeves", "Tumble Dry (₹)": 235, "Clean Craft (₹)": 230 },
    { SNo: 12, Item: "Jacket with Hood", "Tumble Dry (₹)": 380, "Clean Craft (₹)": 375 },
    { SNo: 13, Item: "Leather Jacket", "Tumble Dry (₹)": 440, "Clean Craft (₹)": 430 },
    { SNo: 14, Item: "Sweater", "Tumble Dry (₹)": 170, "Clean Craft (₹)": 160 },
    { SNo: 15, Item: "Long Pullover", "Tumble Dry (₹)": 140, "Clean Craft (₹)": 130 },
    { SNo: 16, Item: "Kurta", "Tumble Dry (₹)": 130, "Clean Craft (₹)": 125 },
    { SNo: 17, Item: "Kurta Heavy", "Tumble Dry (₹)": 190, "Clean Craft (₹)": 170 },
    { SNo: 18, Item: "Dhoti", "Tumble Dry (₹)": 130, "Clean Craft (₹)": 120 },
    { SNo: 19, Item: "Safari Suit Coat", "Tumble Dry (₹)": 310, "Clean Craft (₹)": 210 },
    { SNo: 20, Item: "Safari Suit Pant", "Tumble Dry (₹)": 130, "Clean Craft (₹)": 125 },
    { SNo: 21, Item: "Achkan", "Tumble Dry (₹)": 440, "Clean Craft (₹)": 400 },
    { SNo: 22, Item: "Shorts", "Tumble Dry (₹)": 100, "Clean Craft (₹)": 90 },
    { SNo: 23, Item: "Pyjama", "Tumble Dry (₹)": 100, "Clean Craft (₹)": 90 },
    { SNo: 24, Item: "Capri", "Tumble Dry (₹)": 100, "Clean Craft (₹)": 90 },
    { SNo: 25, Item: "Sweat Pants", "Tumble Dry (₹)": 160, "Clean Craft (₹)": 120 },
    { SNo: 26, Item: "Track Pant", "Tumble Dry (₹)": 130, "Clean Craft (₹)": 120 },
    { SNo: 27, Item: "Swimming Costume", "Tumble Dry (₹)": 50, "Clean Craft (₹)": 45 },
    { SNo: 28, Item: "Under Wear", "Tumble Dry (₹)": 50, "Clean Craft (₹)": 45 },
    { SNo: 29, Item: "Vest", "Tumble Dry (₹)": 50, "Clean Craft (₹)": 45 },
  ],
  "Women's Clothing": [
    { SNo: 1, Item: "Kurta Plain", "Tumble Dry (₹)": 130, "Clean Craft (₹)": 125 },
    { SNo: 2, Item: "Kurta Very Heavy", "Tumble Dry (₹)": 275, "Clean Craft (₹)": 270 },
    { SNo: 3, Item: "Plazo Plain", "Tumble Dry (₹)": 100, "Clean Craft (₹)": 90 },
    { SNo: 4, Item: "Plazo Heavy", "Tumble Dry (₹)": 200, "Clean Craft (₹)": 150 },
    { SNo: 5, Item: "Dupatta", "Tumble Dry (₹)": 80, "Clean Craft (₹)": 75 },
    { SNo: 6, Item: "Dupatta Heavy", "Tumble Dry (₹)": 110, "Clean Craft (₹)": 100 },
    { SNo: 7, Item: "Saree Plain", "Tumble Dry (₹)": 170, "Clean Craft (₹)": 160 },
    { SNo: 8, Item: "Saree Heavy", "Tumble Dry (₹)": 255, "Clean Craft (₹)": 250 },
    { SNo: 9, Item: "Saree Very Heavy", "Tumble Dry (₹)": 330, "Clean Craft (₹)": 325 },
    { SNo: 10, Item: "Petticoat", "Tumble Dry (₹)": 70, "Clean Craft (₹)": 65 },
    { SNo: 11, Item: "Blouse", "Tumble Dry (₹)": 70, "Clean Craft (₹)": 65 },
    { SNo: 12, Item: "Blouse Heavy", "Tumble Dry (₹)": 100, "Clean Craft (₹)": 95 },
    { SNo: 13, Item: "Dress Plain", "Tumble Dry (₹)": 290, "Clean Craft (₹)": 280 },
    { SNo: 14, Item: "Dress Very Heavy", "Tumble Dry (₹)": 450, "Clean Craft (₹)": 440 },
    { SNo: 15, Item: "Dress Long Plain", "Tumble Dry (₹)": 390, "Clean Craft (₹)": 380 },
    { SNo: 16, Item: "Dress Long Very Heavy", "Tumble Dry (₹)": 590, "Clean Craft (₹)": 580 },
    { SNo: 17, Item: "Lehnga Plain", "Tumble Dry (₹)": 440, "Clean Craft (₹)": 430 },
    { SNo: 18, Item: "Lehnga Heavy", "Tumble Dry (₹)": 570, "Clean Craft (₹)": 555 },
    { SNo: 19, Item: "Lehnga Very Heavy", "Tumble Dry (₹)": 710, "Clean Craft (₹)": 700 },
    { SNo: 20, Item: "Skirt Short Plain", "Tumble Dry (₹)": 200, "Clean Craft (₹)": 190 },
    { SNo: 21, Item: "Skirt Short Heavy", "Tumble Dry (₹)": 290, "Clean Craft (₹)": 280 },
    { SNo: 22, Item: "Skirt Long Plain", "Tumble Dry (₹)": 275, "Clean Craft (₹)": 265 },
    { SNo: 23, Item: "Skirt Long Heavy", "Tumble Dry (₹)": 330, "Clean Craft (₹)": 300 },
    { SNo: 24, Item: "Top Plain", "Tumble Dry (₹)": 130, "Clean Craft (₹)": 125 },
    { SNo: 25, Item: "Top Heavy", "Tumble Dry (₹)": 190, "Clean Craft (₹)": 185 },
    { SNo: 26, Item: "Top Woollen", "Tumble Dry (₹)": 190, "Clean Craft (₹)": 180 },
    { SNo: 27, Item: "Shirt", "Tumble Dry (₹)": 110, "Clean Craft (₹)": 100 },
    { SNo: 28, Item: "T Shirt", "Tumble Dry (₹)": 100, "Clean Craft (₹)": 90 },
    { SNo: 29, Item: "Pants", "Tumble Dry (₹)": 130, "Clean Craft (₹)": 110 },
    { SNo: 30, Item: "Jeans", "Tumble Dry (₹)": 130, "Clean Craft (₹)": 125 },
    { SNo: 31, Item: "Jumper", "Tumble Dry (₹)": 190, "Clean Craft (₹)": 180 },
    { SNo: 32, Item: "Dangree", "Tumble Dry (₹)": 190, "Clean Craft (₹)": 180 },
    { SNo: 33, Item: "Legging", "Tumble Dry (₹)": 100, "Clean Craft (₹)": 90 },
    { SNo: 34, Item: "Capri", "Tumble Dry (₹)": 100, "Clean Craft (₹)": 90 },
    { SNo: 35, Item: "Slacks", "Tumble Dry (₹)": 100, "Clean Craft (₹)": 98 },
    { SNo: 36, Item: "Stole Plain", "Tumble Dry (₹)": 80, "Clean Craft (₹)": 75 },
    { SNo: 37, Item: "Stole Heavy", "Tumble Dry (₹)": 110, "Clean Craft (₹)": 100 },
    { SNo: 38, Item: "Shawl Plain", "Tumble Dry (₹)": 140, "Clean Craft (₹)": 130 },
    { SNo: 39, Item: "Shawl Heavy", "Tumble Dry (₹)": 180, "Clean Craft (₹)": 170 },
    { SNo: 40, Item: "Scarf", "Tumble Dry (₹)": 70, "Clean Craft (₹)": 60 },
    { SNo: 41, Item: "Coat", "Tumble Dry (₹)": 310, "Clean Craft (₹)": 300 },
    { SNo: 42, Item: "Long Coat", "Tumble Dry (₹)": 460, "Clean Craft (₹)": 440 },
    { SNo: 43, Item: "Jacket Full Sleeves", "Tumble Dry (₹)": 310, "Clean Craft (₹)": 300 },
    { SNo: 44, Item: "Jacket Half Sleeves", "Tumble Dry (₹)": 235, "Clean Craft (₹)": 220 },
    { SNo: 45, Item: "Jacket with Hood", "Tumble Dry (₹)": 380, "Clean Craft (₹)": 370 },
    { SNo: 46, Item: "Sweat Shirt with Hood", "Tumble Dry (₹)": 200, "Clean Craft (₹)": 190 },
    { SNo: 47, Item: "Sweater Full Sleeves Plain", "Tumble Dry (₹)": 140, "Clean Craft (₹)": 130 },
    { SNo: 48, Item: "Sweater Full Sleeves Heavy", "Tumble Dry (₹)": 170, "Clean Craft (₹)": 160 },
    { SNo: 49, Item: "Sweater Half Sleeves Plain", "Tumble Dry (₹)": 100, "Clean Craft (₹)": 90 },
    { SNo: 50, Item: "Sweater Half Sleeves Heavy", "Tumble Dry (₹)": 130, "Clean Craft (₹)": 125 },
    { SNo: 51, Item: "Long Pullover", "Tumble Dry (₹)": 200, "Clean Craft (₹)": 190 },
    { SNo: 52, Item: "Stocking", "Tumble Dry (₹)": 100, "Clean Craft (₹)": 90 },
    { SNo: 53, Item: "Track Pant", "Tumble Dry (₹)": 130, "Clean Craft (₹)": 120 },
  ],
  "Kids' Clothing": [
    { SNo: 1, Item: "Shirt", "Tumble Dry (₹)": 90, "Clean Craft (₹)": 80 },
    { SNo: 2, Item: "Shirt Woolen", "Tumble Dry (₹)": 110, "Clean Craft (₹)": 100 },
    { SNo: 3, Item: "T Shirt", "Tumble Dry (₹)": 80, "Clean Craft (₹)": 70 },
    { SNo: 4, Item: "Top Plain", "Tumble Dry (₹)": 100, "Clean Craft (₹)": 90 },
    { SNo: 5, Item: "Top Heavy", "Tumble Dry (₹)": 150, "Clean Craft (₹)": 140 },
    { SNo: 6, Item: "Pants", "Tumble Dry (₹)": 100, "Clean Craft (₹)": 90 },
    { SNo: 7, Item: "Jeans", "Tumble Dry (₹)": 100, "Clean Craft (₹)": 90 },
    { SNo: 8, Item: "Capri", "Tumble Dry (₹)": 80, "Clean Craft (₹)": 70 },
    { SNo: 9, Item: "Shorts", "Tumble Dry (₹)": 80, "Clean Craft (₹)": 70 },
    { SNo: 10, Item: "Jumper", "Tumble Dry (₹)": 150, "Clean Craft (₹)": 140 },
    { SNo: 11, Item: "Dangree", "Tumble Dry (₹)": 150, "Clean Craft (₹)": 140 },
    { SNo: 12, Item: "Frock Plain", "Tumble Dry (₹)": 180, "Clean Craft (₹)": 170 },
    { SNo: 13, Item: "Frock Heavy", "Tumble Dry (₹)": 225, "Clean Craft (₹)": 220 },
    { SNo: 14, Item: "Frock Very Heavy", "Tumble Dry (₹)": 275, "Clean Craft (₹)": 270 },
    { SNo: 15, Item: "Skirt Plain", "Tumble Dry (₹)": 245, "Clean Craft (₹)": 240 },
    { SNo: 16, Item: "Baby Blanket", "Tumble Dry (₹)": 275, "Clean Craft (₹)": 270 },
    { SNo: 17, Item: "Skirt Heavy", "Tumble Dry (₹)": 300, "Clean Craft (₹)": 290 },
    { SNo: 18, Item: "Skirt Very Heavy", "Tumble Dry (₹)": 390, "Clean Craft (₹)": 380 },
    { SNo: 19, Item: "Dress Plain", "Tumble Dry (₹)": 235, "Clean Craft (₹)": 220 },
    { SNo: 20, Item: "Dress Very Heavy", "Tumble Dry (₹)": 370, "Clean Craft (₹)": 360 },
    { SNo: 21, Item: "Sherwani", "Tumble Dry (₹)": 360, "Clean Craft (₹)": 350 },
    { SNo: 22, Item: "Kurta Plain", "Tumble Dry (₹)": 100, "Clean Craft (₹)": 90 },
    { SNo: 23, Item: "Kurta Very Heavy", "Tumble Dry (₹)": 225, "Clean Craft (₹)": 215 },
    { SNo: 24, Item: "Salwar Plain", "Tumble Dry (₹)": 80, "Clean Craft (₹)": 70 },
    { SNo: 25, Item: "Salwar Heavy", "Tumble Dry (₹)": 130, "Clean Craft (₹)": 120 },
    { SNo: 26, Item: "Dupatta", "Tumble Dry (₹)": 60, "Clean Craft (₹)": 50 },
    { SNo: 27, Item: "Dupatta Very Heavy", "Tumble Dry (₹)": 140, "Clean Craft (₹)": 130 },
    { SNo: 28, Item: "Blouse", "Tumble Dry (₹)": 60, "Clean Craft (₹)": 50 },
    { SNo: 29, Item: "Blouse Heavy", "Tumble Dry (₹)": 80, "Clean Craft (₹)": 70 },
    { SNo: 30, Item: "Lehnga Plain", "Tumble Dry (₹)": 360, "Clean Craft (₹)": 350 },
    { SNo: 31, Item: "Lehnga Heavy", "Tumble Dry (₹)": 470, "Clean Craft (₹)": 460 },
    { SNo: 32, Item: "Coat", "Tumble Dry (₹)": 245, "Clean Craft (₹)": 235 },
    { SNo: 33, Item: "Waist Coat", "Tumble Dry (₹)": 110, "Clean Craft (₹)": 100 },
    { SNo: 34, Item: "Long Coat", "Tumble Dry (₹)": 380, "Clean Craft (₹)": 380 },
    { SNo: 35, Item: "Long Pullover", "Tumble Dry (₹)": 160, "Clean Craft (₹)": 150 },
    { SNo: 36, Item: "Jacket Full Sleeves", "Tumble Dry (₹)": 245, "Clean Craft (₹)": 230 },
    { SNo: 37, Item: "Jacket Half Sleeves", "Tumble Dry (₹)": 190, "Clean Craft (₹)": 180 },
    { SNo: 38, Item: "Jacket with Hood", "Tumble Dry (₹)": 300, "Clean Craft (₹)": 290 },
    { SNo: 39, Item: "Sweater Full Sleeves Plain", "Tumble Dry (₹)": 110, "Clean Craft (₹)": 100 },
    { SNo: 40, Item: "Sweater Full Sleeves Heavy", "Tumble Dry (₹)": 140, "Clean Craft (₹)": 130 },
    { SNo: 41, Item: "Sweater Half Sleeves Plain", "Tumble Dry (₹)": 80, "Clean Craft (₹)": 70 },
    { SNo: 42, Item: "Sweater Half Sleeves Heavy", "Tumble Dry (₹)": 100, "Clean Craft (₹)": 90 },
    { SNo: 43, Item: "Sweat Shirt", "Tumble Dry (₹)": 140, "Clean Craft (₹)": 130 },
    { SNo: 44, Item: "Sweat Shirt with Hood", "Tumble Dry (₹)": 160, "Clean Craft (₹)": 150 },
    { SNo: 45, Item: "Swimming Costume", "Tumble Dry (₹)": 40, "Clean Craft (₹)": 30 },
    { SNo: 46, Item: "Legging", "Tumble Dry (₹)": 80, "Clean Craft (₹)": 70 },
    { SNo: 47, Item: "Track Pant", "Tumble Dry (₹)": 100, "Clean Craft (₹)": 90 },
    { SNo: 48, Item: "Baby Blanket", "Tumble Dry (₹)": 275, "Clean Craft (₹)": 270 },
  ],
  "Other Items": [
    { SNo: 1, Item: "Soft Toy Small", "Tumble Dry (₹)": 225, "Clean Craft (₹)": 220 },
    { SNo: 2, Item: "Soft Toy Medium", "Tumble Dry (₹)": 370, "Clean Craft (₹)": 360 },
    { SNo: 3, Item: "Soft Toy Large", "Tumble Dry (₹)": 500, "Clean Craft (₹)": 490 },
    { SNo: 4, Item: "Soft Toy Extra Large", "Tumble Dry (₹)": 640, "Clean Craft (₹)": 600 },
    { SNo: 5, Item: "Soft Toy Full Size", "Tumble Dry (₹)": 820, "Clean Craft (₹)": 800 },
    { SNo: 6, Item: "Suit Case Small", "Tumble Dry (₹)": 275, "Clean Craft (₹)": 270 },
    { SNo: 7, Item: "Suit Case Medium", "Tumble Dry (₹)": 420, "Clean Craft (₹)": 410 },
    { SNo: 8, Item: "Suit Case Large", "Tumble Dry (₹)": 570, "Clean Craft (₹)": 560 },
    { SNo: 9, Item: "Suit Case Extra Large", "Tumble Dry (₹)": 720, "Clean Craft (₹)": 700 },
    { SNo: 10, Item: "Handbag Canvass Jute Cloth based Large", "Tumble Dry (₹)": 440, "Clean Craft (₹)": 400 },
    { SNo: 11, Item: "Handbag Canvass Jute Cloth based Small", "Tumble Dry (₹)": 310, "Clean Craft (₹)": 300 },
    { SNo: 12, Item: "Handbag Leather Small", "Tumble Dry (₹)": 440, "Clean Craft (₹)": 430 },
    { SNo: 13, Item: "Handbag Leather Large", "Tumble Dry (₹)": 640, "Clean Craft (₹)": 630 },
    { SNo: 14, Item: "Handkerchief", "Tumble Dry (₹)": 50, "Clean Craft (₹)": 40 },
    { SNo: 15, Item: "Hat", "Tumble Dry (₹)": 180, "Clean Craft (₹)": 170 },
    { SNo: 16, Item: "Cap", "Tumble Dry (₹)": 180, "Clean Craft (₹)": 170 },
    { SNo: 17, Item: "Muffler", "Tumble Dry (₹)": 110, "Clean Craft (₹)": 100 },
    { SNo: 18, Item: "Rain Coat", "Tumble Dry (₹)": 225, "Clean Craft (₹)": 220 },
    { SNo: 19, Item: "Tie", "Tumble Dry (₹)": 50, "Clean Craft (₹)": 40 },
    { SNo: 20, Item: "Bath Robe", "Tumble Dry (₹)": 170, "Clean Craft (₹)": 160 },
    { SNo: 21, Item: "Belt", "Tumble Dry (₹)": 225, "Clean Craft (₹)": 220 },
    { SNo: 22, Item: "Wallet", "Tumble Dry (₹)": 225, "Clean Craft (₹)": 220 },
    { SNo: 23, Item: "Car Seat Cover", "Tumble Dry (₹)": 195, "Clean Craft (₹)": 190 },
    { SNo: 24, Item: "Gloves", "Tumble Dry (₹)": 65, "Clean Craft (₹)": 60 },
    { SNo: 25, Item: "Socks", "Tumble Dry (₹)": 65, "Clean Craft (₹)": 60 },
    { SNo: 26, Item: "Face Mask", "Tumble Dry (₹)": 60, "Clean Craft (₹)": 50 },
    { SNo: 27, Item: "Seat Cover", "Tumble Dry (₹)": 60, "Clean Craft (₹)": 50 },
  ],
  "Household Items": [
    { SNo: 1, Item: "Curtain Door", "Tumble Dry (₹)": 180, "Clean Craft (₹)": 170 },
    { SNo: 2, Item: "Curtain Door With Lining", "Tumble Dry (₹)": 295, "Clean Craft (₹)": 280 },
    { SNo: 3, Item: "Curtain Window", "Tumble Dry (₹)": 140, "Clean Craft (₹)": 130 },
    { SNo: 4, Item: "Curtain Window With Lining", "Tumble Dry (₹)": 235, "Clean Craft (₹)": 230 },
    { SNo: 5, Item: "Curtain Belt", "Tumble Dry (₹)": 60, "Clean Craft (₹)": 50 },
    { SNo: 6, Item: "Blind Door", "Tumble Dry (₹)": 290, "Clean Craft (₹)": 280 },
    { SNo: 7, Item: "Blind Window", "Tumble Dry (₹)": 225, "Clean Craft (₹)": 220 },
    { SNo: 8, Item: "Blanket Single", "Tumble Dry (₹)": 345, "Clean Craft (₹)": 335 },
    { SNo: 9, Item: "Blanket Single 2 Ply", "Tumble Dry (₹)": 425, "Clean Craft (₹)": 420 },
    { SNo: 10, Item: "Blanket Double", "Tumble Dry (₹)": 445, "Clean Craft (₹)": 435 },
    { SNo: 11, Item: "Blanket Double 2 Ply", "Tumble Dry (₹)": 545, "Clean Craft (₹)": 535 },
    { SNo: 12, Item: "Quilt Single", "Tumble Dry (₹)": 425, "Clean Craft (₹)": 420 },
    { SNo: 13, Item: "Quilt Double", "Tumble Dry (₹)": 545, "Clean Craft (₹)": 535 },
    { SNo: 14, Item: "Quilt Cover Single", "Tumble Dry (₹)": 245, "Clean Craft (₹)": 240 },
    { SNo: 15, Item: "Quilt Cover Double", "Tumble Dry (₹)": 300, "Clean Craft (₹)": 290 },
    { SNo: 16, Item: "Duvet", "Tumble Dry (₹)": 90, "Clean Craft (₹)": 80 },
    { SNo: 17, Item: "Duvet Double", "Tumble Dry (₹)": 130, "Clean Craft (₹)": 125 },
    { SNo: 18, Item: "Bed Sheet Single", "Tumble Dry (₹)": 140, "Clean Craft (₹)": 135 },
    { SNo: 19, Item: "Bed Sheet Double", "Tumble Dry (₹)": 170, "Clean Craft (₹)": 165 },
    { SNo: 20, Item: "Bed Spread Single", "Tumble Dry (₹)": 245, "Clean Craft (₹)": 240 },
    { SNo: 21, Item: "Bed Spread Double", "Tumble Dry (₹)": 300, "Clean Craft (₹)": 290 },
    { SNo: 22, Item: "Sofa Cover Small", "Tumble Dry (₹)": 60, "Clean Craft (₹)": 50 },
    { SNo: 23, Item: "Sofa Cover Medium", "Tumble Dry (₹)": 110, "Clean Craft (₹)": 100 },
    { SNo: 24, Item: "Sofa Cover Large", "Tumble Dry (₹)": 160, "Clean Craft (₹)": 150 },
    { SNo: 25, Item: "Cushion Covers", "Tumble Dry (₹)": 60, "Clean Craft (₹)": 50 },
    { SNo: 26, Item: "Cushion Covers Medium", "Tumble Dry (₹)": 110, "Clean Craft (₹)": 100 },
    { SNo: 27, Item: "Cushion Covers Large", "Tumble Dry (₹)": 160, "Clean Craft (₹)": 150 },
    { SNo: 28, Item: "Cushion Small", "Tumble Dry (₹)": 140, "Clean Craft (₹)": 130 },
    { SNo: 29, Item: "Cushion Medium", "Tumble Dry (₹)": 200, "Clean Craft (₹)": 190 },
    { SNo: 30, Item: "Cushion Large", "Tumble Dry (₹)": 265, "Clean Craft (₹)": 250 },
    { SNo: 31, Item: "Pillow Covers", "Tumble Dry (₹)": 60, "Clean Craft (₹)": 50 },
    { SNo: 32, Item: "Chair Covers", "Tumble Dry (₹)": 60, "Clean Craft (₹)": 50 },
    { SNo: 33, Item: "Hand Towel", "Tumble Dry (₹)": 50, "Clean Craft (₹)": 40 },
    { SNo: 34, Item: "Towel Large", "Tumble Dry (₹)": 140, "Clean Craft (₹)": 130 },
    { SNo: 35, Item: "Carpet", "Tumble Dry (₹)": 45, "Clean Craft (₹)": 40 },
    { SNo: 36, Item: "Table Cloth Small", "Tumble Dry (₹)": 80, "Clean Craft (₹)": 70 },
    { SNo: 37, Item: "Table Cloth Large", "Tumble Dry (₹)": 140, "Clean Craft (₹)": 130 },
    { SNo: 38, Item: "Table Mat", "Tumble Dry (₹)": 60, "Clean Craft (₹)": 50 },
    { SNo: 39, Item: "Foot Mats", "Tumble Dry (₹)": 70, "Clean Craft (₹)": 60 },
    { SNo: 40, Item: "Mattress Double", "Tumble Dry (₹)": 2040, "Clean Craft (₹)": 2000 },
    { SNo: 41, Item: "Bed Head", "Tumble Dry (₹)": 1540, "Clean Craft (₹)": 1500 },
    { SNo: 42, Item: "Mattress Single", "Tumble Dry (₹)": 1040, "Clean Craft (₹)": 1000 },
  ],
  "Shoes": [
    { SNo: 1, Item: "Sport Shoes (Pair)", "Tumble Dry (₹)": 320, "Clean Craft (₹)": 310 },
    { SNo: 2, Item: "Canvass Shoes (Pair)", "Tumble Dry (₹)": 320, "Clean Craft (₹)": 310 },
    { SNo: 3, Item: "Leather Shoes (Pair)", "Tumble Dry (₹)": 530, "Clean Craft (₹)": 520 },
    { SNo: 4, Item: "Suede Leather Shoes", "Tumble Dry (₹)": 620, "Clean Craft (₹)": 610 },
    { SNo: 5, Item: "Ankle Length Boots", "Tumble Dry (₹)": 750, "Clean Craft (₹)": 740 },
    { SNo: 6, Item: "Mid Length Boots", "Tumble Dry (₹)": 1070, "Clean Craft (₹)": 1000 },
    { SNo: 7, Item: "Knee Length Boots", "Tumble Dry (₹)": 1470, "Clean Craft (₹)": 1400 },
    { SNo: 8, Item: "Sandals (Pair)", "Tumble Dry (₹)": 320, "Clean Craft (₹)": 300 },
    { SNo: 9, Item: "Slippers (Pair)", "Tumble Dry (₹)": 260, "Clean Craft (₹)": 230 },
    { SNo: 10, Item: "Helmet", "Tumble Dry (₹)": 375, "Clean Craft (₹)": 300 },
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
                      <TableHead className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Tumble Dry (₹)</TableHead>
                      <TableHead className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Clean Craft (₹)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredItems().map((item, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="px-6 py-4 text-sm font-medium text-gray-900">{item.SNo}</TableCell>
                        <TableCell className="px-6 py-4 text-sm text-gray-900">{item.Item}</TableCell>
                        <TableCell className="px-6 py-4 text-sm text-center text-gray-900">{item["Tumble Dry (₹)"]}</TableCell>
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
