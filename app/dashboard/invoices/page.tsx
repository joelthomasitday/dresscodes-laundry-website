"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboardAuth } from "@/contexts/dashboard-auth-context";
import { DashboardNav, MobilePageHeader } from "@/components/dashboard-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Printer,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
// Removind top-level pdf and PremiumInvoicePDF to avoid ChunkLoadError
// and move them to dynamic imports inside the handler.

interface InvoiceItem {
  _id: string;
  invoiceNumber: string;
  customer: { name: string; phone: string };
  total: number;
  status: "draft" | "sent" | "paid";
  createdAt: string;
  items: { name: string; qty: number; price: number; total: number }[];
}

export default function InvoicesPage() {
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
  } = useDashboardAuth();
  const router = useRouter();
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/dashboard/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchInvoices();
    }
  }, [isAuthenticated, page]);

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/invoices?page=${page}&limit=10`);
      const data = await res.json();

      if (res.ok) {
        setInvoices(data.invoices);
        setTotalPages(data.pagination.totalPages);
      } else {
        setError(data.error || "Failed to fetch invoices");
        setInvoices([]);
      }
    } catch (err) {
      console.error("Failed to fetch invoices:", err);
      setError("An unexpected error occurred while fetching invoices.");
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (invoice: InvoiceItem) => {
    const data = {
      invoiceNumber: invoice.invoiceNumber,
      customerName: invoice.customer.name,
      customerPhone: invoice.customer.phone,
      date: new Date(invoice.createdAt).toLocaleDateString(),
      items: invoice.items,
      subtotal: invoice.total / 1.18,
      tax: invoice.total - invoice.total / 1.18,
      total: invoice.total,
      notes: "Thank you for choosing Dresscode Laundry. We appreciate your business!",
    };

    try {
      // Lazy load dependencies to avoid ChunkLoadError on page load
      const [{ pdf }, { PremiumInvoicePDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/premium-invoice"),
      ]);

      const blob = await pdf(<PremiumInvoicePDF data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      alert("Failed to generate premium invoice. Please try again.");
    }
  };


  if (authLoading) return null;

  const STATUS_COLORS = {
    paid: "bg-green-100 text-green-700",
    sent: "bg-blue-100 text-blue-700",
    draft: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/80 via-white to-white">
      <MobilePageHeader title="Invoices" backHref="/dashboard" />
      <DashboardNav />

      <main className="pt-16 pb-24 md:pt-0 md:ml-64 md:pb-8">
        <div className="p-5 pt-3 md:p-6 lg:p-8 space-y-5 max-w-lg mx-auto md:max-w-none">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-gray-800">Invoices</h1>
              <p className="text-sm text-gray-400">
                View and manage customer billing
              </p>
            </div>
            <Button
              asChild
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <Link href="/dashboard/invoices/new">
                <Plus className="h-4 w-4 mr-2" />
                Create
              </Link>
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoices..."
              className="pl-11 bg-white border-gray-200 text-gray-800 rounded-2xl h-12 shadow-sm focus:border-emerald-400 focus:ring-emerald-500/20"
            />
          </div>

          {/* Invoice list */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  className="h-24 bg-gray-100/50 rounded-2xl"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-red-100 shadow-sm">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-500 text-base font-medium">{error}</p>
              <Button
                variant="outline"
                className="mt-4 border-red-200 text-red-500 hover:bg-red-50 rounded-full"
                onClick={fetchInvoices}
              >
                Try Again
              </Button>
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No invoices found</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {invoices.map((invoice) => (
                <div
                  key={invoice._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-4 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-800">
                          {invoice.invoiceNumber}
                        </span>
                        <Badge
                          className={`${
                            STATUS_COLORS[invoice.status]
                          } text-[10px] rounded-full px-2.5 capitalize`}
                        >
                          {invoice.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {invoice.customer.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(
                          invoice.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <span className="text-lg font-bold text-gray-800">
                        ₹{invoice.total}
                      </span>
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors"
                          onClick={() => handleDownloadPDF(invoice)}
                        >
                          <Printer className="h-4 w-4" />
                        </button>
                        <button className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && !loading && !error && (
            <div className="flex justify-center gap-4 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="bg-white border-gray-200 text-gray-600 hover:bg-gray-50 rounded-full h-10 w-10 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-400 font-medium flex items-center">
                {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="bg-white border-gray-200 text-gray-600 hover:bg-gray-50 rounded-full h-10 w-10 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
