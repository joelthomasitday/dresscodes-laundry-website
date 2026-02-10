"use client";

import { useEffect, useState } from "react";
import { DashboardNav, MobilePageHeader } from "@/components/dashboard-nav";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const PremiumInvoice = dynamic(() => import("@/components/premium-invoice"), {
  ssr: false,
  loading: () => (
    <div className="h-[800px] w-full flex items-center justify-center bg-slate-50 rounded-3xl border border-dashed border-slate-300">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-slate-500 font-medium">Preparing Premium Preview...</p>
      </div>
    </div>
  ),
});

export default function InvoicePreviewPage() {
  const [data, setData] = useState({
    invoiceNumber: "INV-2024-001",
    customerName: "Alex Thompson",
    customerPhone: "+91 89434 37272",
    customerAddress: "Kottayam, Kerala",
    date: new Date().toLocaleDateString(),
    items: [
      { name: "Premium Suit Dry Cleaning", qty: 2, price: 450, total: 900 },
      { name: "Silk Dress Preservation", qty: 1, price: 850, total: 850 },
      { name: "Egyptian Cotton Shirt Launder", qty: 5, price: 120, total: 600 },
    ],
    subtotal: 2350 / 1.18,
    tax: 2350 - 2350 / 1.18,
    total: 2350,
    notes: "Complimentary fabric protection applied to all garments. Next-day delivery scheduled for Thursday, 12th Feb.",
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <MobilePageHeader title="Invoice Preview" backHref="/dashboard/invoices" />
      <DashboardNav />

      <main className="pt-16 pb-24 md:pt-0 md:ml-64 md:pb-8">
        <div className="p-5 md:p-8 space-y-8 max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Premium Invoice Design</h1>
              <p className="text-slate-500">Live preview of your new high-end laundry brand billing template.</p>
            </div>
            <Button asChild variant="outline" className="rounded-full shadow-sm">
              <Link href="/dashboard/invoices">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Invoices
              </Link>
            </Button>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-emerald-600 p-4 text-white text-center text-sm font-medium tracking-wide">
              PREMIUM EXPERIENCE PREVIEW
            </div>
            <PremiumInvoice data={data} />
          </div>
        </div>
      </main>
    </div>
  );
}
