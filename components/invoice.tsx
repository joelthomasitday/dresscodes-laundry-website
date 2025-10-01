"use client"

import type React from "react"
import { useMemo, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

/* ========== Types ========== */
type BusinessInfo = {
  logoUrl?: string
  name: string
  address: string
  phone?: string
  email?: string
  gstin?: string
}

type InvoiceOrderInfo = {
  invoiceNumber: string
  invoiceDate: string
  orderNumber?: string
  pickupDate?: string
  deliveryDate?: string
}

type CustomerInfo = {
  name: string
  phone?: string
  address?: string
}

type Item = {
  description: string
  qtyOrWeight: number
  rate: number
  amount?: number
  hsnSac?: string
}

type TaxBreakdown = {
  cgstPercent?: number
  cgstAmount?: number
  sgstPercent?: number
  sgstAmount?: number
  igstPercent?: number
  igstAmount?: number
}

type Summary = {
  subtotal: number
  discount?: number
  extraCharges?: number
  tax?: TaxBreakdown
  grandTotal: number
}

type PaymentInfo = {
  method: "Cash" | "UPI" | "Card" | "Wallet" | string
  transactionId?: string
}

type FooterInfo = {
  notes?: string
  showSignaturePlaceholder?: boolean
  qrCodeUrl?: string
}

/* ========== Helpers ========== */
function inr(amount: number) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `₹${amount.toFixed(2)}`
  }
}

/* ========== Embedded Invoice Component (A4, print-friendly) ========== */
function LaundryInvoice({
  business,
  invoice,
  customer,
  items,
  summary,
  payment,
  footer,
  showHSNColumn,
  className,
  exportRef,
}: {
  business: BusinessInfo
  invoice: InvoiceOrderInfo
  customer: CustomerInfo
  items: Item[]
  summary: Summary
  payment: PaymentInfo
  footer?: FooterInfo
  showHSNColumn?: boolean
  className?: string
  exportRef?: (el: HTMLDivElement | null) => void
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [downloading, setDownloading] = useState(false)

  const shouldShowHSN = useMemo(() => {
    if (showHSNColumn) return true
    return items.some((it) => !!it.hsnSac)
  }, [items, showHSNColumn])

  async function handleDownload() {
    if (!containerRef.current) return
    setDownloading(true)
    try {
      const html2pdf = (await import("html2pdf.js")).default
      const element = containerRef.current
      const fileName = `invoice-${invoice.invoiceNumber || "laundry"}.pdf`
      const opt = {
        margin: [10, 8, 10, 8] as [number, number, number, number],
        filename: fileName,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm" as const, format: "a4" as const, orientation: "portrait" as const },
        pagebreak: { mode: ["css", "legacy"] as const },
      }
      await html2pdf().set(opt).from(element).save()
    } finally {
      setDownloading(false)
    }
  }

  const tableHeaderClass = "uppercase tracking-wide text-sm font-medium border-b border-[var(--color-invoice-border)]"
  const rowClass = "border-b border-[var(--color-invoice-border)] break-inside-avoid"
  const labelClass = "text-xs text-black/60"
  const sectionTitleClass = "uppercase text-sm font-medium tracking-wide"

  return (
    <div className={className}>
      <div
        ref={(el) => {
          containerRef.current = el
          exportRef?.(el)
        }}
        style={
          {
            "--color-invoice-bg": "#ffffff",
            "--color-invoice-fg": "#000000",
            "--color-invoice-accent": "#064420",
            "--color-invoice-border": "#064420",
            "--inv-bg": "var(--color-invoice-bg)",
            "--inv-fg": "var(--color-invoice-fg)",
            "--inv-accent": "var(--color-invoice-accent)",
            "--inv-border": "var(--color-invoice-border)",
          } as React.CSSProperties
        }
        className="mx-auto bg-[var(--inv-bg)] text-[var(--inv-fg)] border border-[var(--inv-border)] rounded-lg print:rounded-none print:border-0 p-6 md:p-8 w-full max-w-[794px] font-helvetica shadow-lg print:shadow-none"
      >
        <style>{`
          @media print {
            @page { size: A4; margin: 10mm; }
            .no-print { display: none !important; }
          }
          .break-inside-avoid { break-inside: avoid; page-break-inside: avoid; }
          * { font-family: 'Helvetica', 'Times New Roman', Arial, sans-serif; }
        `}</style>

        {/* Header Section */}
        <header className="text-center mb-8 pb-4 border-b border-[var(--inv-border)]">
          <h1 className="text-3xl font-bold tracking-wide uppercase mb-2">{business.name}</h1>
          <p className="text-sm text-gray-700 mb-1">{business.address}</p>
          {(business.phone || business.email) && (
            <p className="text-sm text-gray-700">
              {business.phone && `Phone: ${business.phone}`}
              {business.phone && business.email && " | "}
              {business.email && `Email: ${business.email}`}
            </p>
          )}
        </header>

        {/* Invoice Details - Top Right */}
        <div className="flex justify-between items-start mb-6">
          <div></div>
          <div className="text-right text-sm">
            <div className="mb-1"><span className="font-medium">Invoice Number:</span> {invoice.invoiceNumber}</div>
            <div className="mb-1"><span className="font-medium">Invoice Date:</span> {invoice.invoiceDate}</div>
            {invoice.deliveryDate && (
              <div><span className="font-medium">Due Date:</span> {invoice.deliveryDate}</div>
            )}
          </div>
        </div>

        {/* Customer Details - Left Side */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2">Bill To:</h2>
          <div className="text-sm">
            <p className="font-medium mb-1">{customer.name}</p>
            {customer.phone && <p className="text-gray-700">Phone: {customer.phone}</p>}
            {customer.address && <p className="text-gray-700 whitespace-pre-wrap">{customer.address}</p>}
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left font-medium">Item Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-medium">Quantity</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-medium">Price</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => {
                const amount = typeof it.amount === "number" ? it.amount : it.qtyOrWeight * it.rate
                return (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="px-4 py-2">{it.description}</td>
                    <td className="px-4 py-2">{it.qtyOrWeight}</td>
                    <td className="px-4 py-2 text-right">{inr(it.rate)}</td>
                    <td className="px-4 py-2 text-right">{inr(amount)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Totals Section - Bottom Right */}
        <div className="flex justify-end mb-8">
          <div className="w-64 text-sm">
            <div className="flex justify-between py-1">
              <span>Subtotal:</span>
              <span>{inr(summary.subtotal)}</span>
            </div>

            {summary.tax && (
              <>
                {(summary.tax.cgstPercent || summary.tax.cgstAmount) && (
                  <div className="flex justify-between py-1">
                    <span>Tax ({summary.tax.cgstPercent || summary.tax.sgstPercent}%):</span>
                    <span>{inr((summary.tax.cgstAmount || 0) + (summary.tax.sgstAmount || 0))}</span>
                  </div>
                )}
              </>
            )}

            {typeof summary.discount === "number" && summary.discount !== 0 && (
              <div className="flex justify-between py-1">
                <span>Discount:</span>
                <span>-{inr(Math.abs(summary.discount))}</span>
              </div>
            )}

            {typeof summary.extraCharges === "number" && summary.extraCharges !== 0 && (
              <div className="flex justify-between py-1">
                <span>Extra Charges:</span>
                <span>{inr(summary.extraCharges)}</span>
              </div>
            )}

            <div className="border-t border-gray-300 my-2"></div>

            <div className="flex justify-between font-bold text-lg">
              <span>Grand Total:</span>
              <span>{inr(summary.grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mb-6 text-sm">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <span className="font-medium">Order Number:</span> {invoice.orderNumber || "N/A"}
            </div>
            {invoice.pickupDate && (
              <div>
                <span className="font-medium">Pickup Date:</span> {invoice.pickupDate}
              </div>
            )}
          </div>
        </div>

        {/* Payment Info (if needed) */}
        {(payment.method || footer?.notes || footer?.qrCodeUrl) && (
          <div className="mb-6 text-sm">
            {payment.method && (
              <div className="mb-2">
                <span className="font-medium">Payment Method:</span> {payment.method} {payment.transactionId && `(${payment.transactionId})`}
              </div>
            )}
            {footer?.notes && (
              <div className="mb-2">
                <span className="font-medium">Notes:</span> {footer.notes}
              </div>
            )}
            {footer?.qrCodeUrl && (
              <div className="flex justify-end">
                <img
                  src={footer.qrCodeUrl || "/placeholder.svg"}
                  alt="QR Code"
                  className="h-20 w-20 object-contain"
                />
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="pt-4 border-t border-gray-300 mt-8">
          <p className="text-center text-sm">Thank you for your business!</p>
        </footer>
      </div>

      <div className="mt-4 no-print flex justify-center">
        <Button
          onClick={handleDownload}
          className="bg-[var(--color-invoice-accent)] text-white hover:opacity-90"
          disabled={downloading}
        >
          {downloading ? "Preparing PDF..." : "Download PDF"}
        </Button>
      </div>
    </div>
  )
}

/* ========== Admin Page (single page) ========== */
export default function Page() {
  // Seed defaults
  const [business, setBusiness] = useState<BusinessInfo>({
    name: "EverGreen Laundry Services",
    address: "12/3 MG Road, Indiranagar, Bengaluru, KA 560038",
    phone: "+91 98765 43210",
    email: "support@evergreenlaundry.in",
    gstin: "29ABCDE1234F1Z5",
    logoUrl: "/abstract-logo.png",
  })
  const [invoice, setInvoice] = useState<InvoiceOrderInfo>({
    invoiceNumber: "INV-2025-0098",
    invoiceDate: "30/09/2025",
    orderNumber: "ORD-78421",
    pickupDate: "28/09/2025",
    deliveryDate: "01/10/2025",
  })
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: "Rohan Sharma",
    phone: "+91 90000 11111",
    address: "501, Palm Heights, Whitefield, Bengaluru, KA 560066",
  })
  const [items, setItems] = useState<Item[]>([
    { description: "Shirt - Wash & Iron", qtyOrWeight: 6, rate: 25, hsnSac: "999799" },
    { description: "Trousers - Steam Press", qtyOrWeight: 3, rate: 20 },
    { description: "Bedsheet (King) - Wash", qtyOrWeight: 2, rate: 60, hsnSac: "999799" },
    { description: "Mixed Laundry (Kg) - Wash & Fold", qtyOrWeight: 3.5, rate: 80 },
  ])
  const [discount, setDiscount] = useState<number>(20)
  const [extraCharges, setExtraCharges] = useState<number>(30)
  const [cgstPercent, setCgstPercent] = useState<number>(9)
  const [sgstPercent, setSgstPercent] = useState<number>(9)
  const [igstPercent, setIgstPercent] = useState<number>(0)
  const [payment, setPayment] = useState<PaymentInfo>({ method: "UPI", transactionId: "UPI-AXIS-0029348" })
  const [footer, setFooter] = useState<FooterInfo>({
    notes:
      "Please check all pockets before handing over clothes. Stains will be treated on best-effort basis. Liability limited to service cost.",
    showSignaturePlaceholder: true,
    qrCodeUrl: "/upi-qr-code.png",
  })
  const [showHSN, setShowHSN] = useState<boolean>(true)

  const invoiceRef = useRef<HTMLDivElement | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Derived summary (auto-compute)
  const summary: Summary = useMemo(() => {
    const subtotal = items.reduce(
      (acc, it) => acc + (typeof it.amount === "number" ? it.amount : it.qtyOrWeight * it.rate),
      0,
    )
    const taxable = subtotal - (discount || 0) + (extraCharges || 0)
    const cgstAmount = ((cgstPercent || 0) / 100) * taxable
    const sgstAmount = ((sgstPercent || 0) / 100) * taxable
    const igstAmount = ((igstPercent || 0) / 100) * taxable
    const grandTotal = taxable + cgstAmount + sgstAmount + igstAmount
    return {
      subtotal,
      discount,
      extraCharges,
      tax: {
        cgstPercent,
        sgstPercent,
        igstPercent,
        cgstAmount,
        sgstAmount,
        igstAmount,
      },
      grandTotal,
    }
  }, [items, discount, extraCharges, cgstPercent, sgstPercent, igstPercent])

  // Handlers
  const updateItem = (index: number, patch: Partial<Item>) => {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)))
  }
  const addItem = () => setItems((prev) => [...prev, { description: "", qtyOrWeight: 1, rate: 0 }])
  const removeItem = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index))

  async function handleSavePreview() {
    if (!invoiceRef.current) return
    setSaving(true)
    try {
      const html2pdf = (await import("html2pdf.js")).default
      const opt = {
        margin: [10, 8, 10, 8] as [number, number, number, number],
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm" as const, format: "a4" as const, orientation: "portrait" as const },
        pagebreak: { mode: ["css", "legacy"] as const },
      }
      const blobUrl: string = await html2pdf().set(opt).from(invoiceRef.current).outputPdf("bloburl")
      setPdfUrl(blobUrl)
    } finally {
      setSaving(false)
    }
  }

  // Admin layout: mobile-first, simple grid
  return (
    <main className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-medium tracking-wide uppercase text-balance">Laundry Invoice Admin</h2>
        <div className="no-print flex items-center gap-2">
          <Button onClick={handleSavePreview} className="bg-[var(--color-invoice-accent)] text-white">
            {saving ? "Saving..." : "Save & Preview PDF"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: Admin form */}
        <section className="space-y-6">
          {/* Business */}
          <div className="rounded-md border p-4">
            <h3 className="uppercase text-sm font-medium tracking-wide mb-3">Header - Business Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="biz-name">Laundry name</Label>
                <Input
                  id="biz-name"
                  value={business.name}
                  onChange={(e) => setBusiness({ ...business, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="biz-logo">Logo URL</Label>
                <Input
                  id="biz-logo"
                  placeholder="/abstract-logo.png"
                  value={business.logoUrl || ""}
                  onChange={(e) => setBusiness({ ...business, logoUrl: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="biz-address">Address</Label>
                <Textarea
                  id="biz-address"
                  rows={2}
                  value={business.address}
                  onChange={(e) => setBusiness({ ...business, address: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="biz-phone">Phone</Label>
                <Input
                  id="biz-phone"
                  value={business.phone || ""}
                  onChange={(e) => setBusiness({ ...business, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="biz-email">Email</Label>
                <Input
                  id="biz-email"
                  value={business.email || ""}
                  onChange={(e) => setBusiness({ ...business, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="biz-gstin">GSTIN</Label>
                <Input
                  id="biz-gstin"
                  value={business.gstin || ""}
                  onChange={(e) => setBusiness({ ...business, gstin: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Invoice & Order */}
          <div className="rounded-md border p-4">
            <h3 className="uppercase text-sm font-medium tracking-wide mb-3">Invoice & Order Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="inv-no">Invoice No</Label>
                <Input
                  id="inv-no"
                  value={invoice.invoiceNumber}
                  onChange={(e) => setInvoice({ ...invoice, invoiceNumber: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="inv-date">Invoice Date</Label>
                <Input
                  id="inv-date"
                  value={invoice.invoiceDate}
                  onChange={(e) => setInvoice({ ...invoice, invoiceDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="order-no">Order No</Label>
                <Input
                  id="order-no"
                  value={invoice.orderNumber || ""}
                  onChange={(e) => setInvoice({ ...invoice, orderNumber: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="pickup-date">Pickup Date</Label>
                <Input
                  id="pickup-date"
                  value={invoice.pickupDate || ""}
                  onChange={(e) => setInvoice({ ...invoice, pickupDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="delivery-date">Delivery Date</Label>
                <Input
                  id="delivery-date"
                  value={invoice.deliveryDate || ""}
                  onChange={(e) => setInvoice({ ...invoice, deliveryDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Customer */}
          <div className="rounded-md border p-4">
            <h3 className="uppercase text-sm font-medium tracking-wide mb-3">Customer Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="cust-name">Name</Label>
                <Input
                  id="cust-name"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="cust-phone">Phone</Label>
                <Input
                  id="cust-phone"
                  value={customer.phone || ""}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                />
              </div>
              <div className="md:col-span-3">
                <Label htmlFor="cust-address">Address</Label>
                <Textarea
                  id="cust-address"
                  rows={2}
                  value={customer.address || ""}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="rounded-md border p-4">
            <div className="flex items-center justify-between">
              <h3 className="uppercase text-sm font-medium tracking-wide mb-3">Items</h3>
              <div className="flex items-center gap-2">
                <Checkbox id="hsn" checked={showHSN} onCheckedChange={(v) => setShowHSN(Boolean(v))} />
                <Label htmlFor="hsn" className="text-sm">
                  Show HSN/SAC
                </Label>
              </div>
            </div>
            <div className="space-y-3">
              {items.map((it, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end border-b pb-3">
                  <div className="md:col-span-5">
                    <Label>Item/Service</Label>
                    <Input value={it.description} onChange={(e) => updateItem(idx, { description: e.target.value })} />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Qty/Weight</Label>
                    <Input
                      type="number"
                      value={it.qtyOrWeight}
                      onChange={(e) => updateItem(idx, { qtyOrWeight: Number.parseFloat(e.target.value || "0") })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Rate (₹)</Label>
                    <Input
                      type="number"
                      value={it.rate}
                      onChange={(e) => updateItem(idx, { rate: Number.parseFloat(e.target.value || "0") })}
                    />
                  </div>
                  {showHSN && (
                    <div className="md:col-span-2">
                      <Label>HSN/SAC</Label>
                      <Input value={it.hsnSac || ""} onChange={(e) => updateItem(idx, { hsnSac: e.target.value })} />
                    </div>
                  )}
                  <div className="md:col-span-1 flex gap-2">
                    <Button variant="secondary" onClick={() => removeItem(idx)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button onClick={addItem}>Add Item</Button>
            </div>
          </div>

          {/* Summary Inputs */}
          <div className="rounded-md border p-4">
            <h3 className="uppercase text-sm font-medium tracking-wide mb-3">Summary & Taxes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Discount (₹)</Label>
                <Input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number.parseFloat(e.target.value || "0"))}
                />
              </div>
              <div>
                <Label>Extra Charges (₹)</Label>
                <Input
                  type="number"
                  value={extraCharges}
                  onChange={(e) => setExtraCharges(Number.parseFloat(e.target.value || "0"))}
                />
              </div>
              <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>CGST %</Label>
                  <Input
                    type="number"
                    value={cgstPercent}
                    onChange={(e) => setCgstPercent(Number.parseFloat(e.target.value || "0"))}
                  />
                </div>
                <div>
                  <Label>SGST %</Label>
                  <Input
                    type="number"
                    value={sgstPercent}
                    onChange={(e) => setSgstPercent(Number.parseFloat(e.target.value || "0"))}
                  />
                </div>
                <div>
                  <Label>IGST %</Label>
                  <Input
                    type="number"
                    value={igstPercent}
                    onChange={(e) => setIgstPercent(Number.parseFloat(e.target.value || "0"))}
                  />
                </div>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-muted-foreground">Computed Subtotal</div>
              <div className="text-right">{inr(summary.subtotal)}</div>
              <div className="text-muted-foreground">Computed Grand Total</div>
              <div className="text-right">{inr(summary.grandTotal)}</div>
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-md border p-4">
            <h3 className="uppercase text-sm font-medium tracking-wide mb-3">Payment Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Payment Method</Label>
                <Select value={String(payment.method)} onValueChange={(v) => setPayment({ ...payment, method: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="Wallet">Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label>Transaction ID</Label>
                <Input
                  value={payment.transactionId || ""}
                  onChange={(e) => setPayment({ ...payment, transactionId: e.target.value })}
                  placeholder="If digital payment"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="rounded-md border p-4">
            <h3 className="uppercase text-sm font-medium tracking-wide mb-3">Footer & QR</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-3">
                <Label>Notes/Terms</Label>
                <Textarea
                  rows={3}
                  value={footer.notes || ""}
                  onChange={(e) => setFooter({ ...footer, notes: e.target.value })}
                />
              </div>
              <div>
                <Label>QR Code URL</Label>
                <Input
                  value={footer.qrCodeUrl || ""}
                  onChange={(e) => setFooter({ ...footer, qrCodeUrl: e.target.value })}
                  placeholder="/upi-qr-code.png"
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="sig"
                  checked={!!footer.showSignaturePlaceholder}
                  onCheckedChange={(v) => setFooter({ ...footer, showSignaturePlaceholder: Boolean(v) })}
                />
                <Label htmlFor="sig">Show signature/stamp placeholder</Label>
              </div>
            </div>
          </div>
        </section>

        {/* Right: Live Invoice Preview */}
        <section className="space-y-4">
          <h3 className="uppercase text-sm font-medium tracking-wide">Preview</h3>
          <LaundryInvoice
            className=""
            business={business}
            invoice={invoice}
            customer={customer}
            items={items}
            summary={summary}
            payment={payment}
            footer={footer}
            showHSNColumn={showHSN}
            exportRef={(el) => {
              invoiceRef.current = el
            }}
          />

          {pdfUrl && (
            <div className="no-print border rounded-md">
              <div className="flex items-center justify-between p-2">
                <div className="text-sm font-medium">Saved PDF Preview</div>
                <div className="flex items-center gap-2">
                  <a
                    href={pdfUrl}
                    download={`invoice-${invoice.invoiceNumber || "laundry"}.pdf`}
                    className="text-sm underline"
                  >
                    Download
                  </a>
                  <Button variant="secondary" onClick={() => setPdfUrl(null)}>
                    Clear
                  </Button>
                </div>
              </div>
              <iframe
                src={pdfUrl}
                title="Invoice PDF Preview"
                className="w-full h-[640px] bg-white"
                style={{ border: "none" }}
              />
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
