import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/toaster"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { AuthProvider } from "@/contexts/auth-context"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: {
    default: "Dresscode Laundry - Professional Laundry & Dry Cleaning Services",
    template: "%s | Dresscode Laundry",
  },
  description:
    "Premium laundry and dry cleaning services with free pickup and delivery in Kottayam. 24-48 hour turnaround, 100% satisfaction guarantee. Book online today!",
  keywords:
    "laundry service, dry cleaning, Kottayam, pickup delivery, wash fold, professional cleaning, Kerala laundry",
  authors: [{ name: "Dresscode Laundry" }],
  creator: "Dresscode Laundry",
  publisher: "Dresscode Laundry",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://dresscodes.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://dresscodes.in",
    title: "Dresscode Laundry - Professional Laundry & Dry Cleaning Services",
    description: "Premium laundry and dry cleaning services with free pickup and delivery in Kottayam",
    siteName: "Dresscode Laundry",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dresscode Laundry - Professional Laundry Services",
    description: "Premium laundry and dry cleaning services with free pickup and delivery in Kottayam",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0d9488" />
      </head>
      <body className={poppins.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <WhatsAppFloat />
        <Toaster />
      </body>
    </html>
  )
}
