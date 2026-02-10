"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboardAuth } from "@/contexts/dashboard-auth-context";
import { DashboardNav } from "@/components/dashboard-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Search,
  Plus,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Printer,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import jsPDF from "jspdf";

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
  const { user, isAuthenticated, isLoading: authLoading } = useDashboardAuth();
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

  const handleDownloadPDF = (invoice: InvoiceItem) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(13, 148, 136); // Teal-600
    doc.text("dresscode laundry", 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Premium Laundry & Dry Cleaning", 20, 26);
    
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text("INVOICE", 150, 20);
    doc.setFontSize(10);
    doc.text(`# ${invoice.invoiceNumber}`, 150, 26);
    
    // Line
    doc.setDrawColor(200);
    doc.line(20, 35, 190, 35);
    
    // Customer info
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", 20, 45);
    doc.setFont("helvetica", "normal");
    doc.text(invoice.customer.name, 20, 52);
    doc.text(invoice.customer.phone, 20, 58);
    
    // Date
    doc.setFont("helvetica", "bold");
    doc.text("Date:", 140, 45);
    doc.setFont("helvetica", "normal");
    doc.text(new Date(invoice.createdAt).toLocaleDateString(), 140, 52);
    
    // Table Header
    let y = 75;
    doc.setFillColor(240);
    doc.rect(20, y - 5, 170, 7, "F");
    doc.setFont("helvetica", "bold");
    doc.text("Item", 25, y);
    doc.text("Qty", 100, y);
    doc.text("Price", 130, y);
    doc.text("Total", 165, y);
    
    // Items
    doc.setFont("helvetica", "normal");
    y += 10;
    invoice.items?.forEach((item) => {
      doc.text(item.name, 25, y);
      doc.text(item.qty.toString(), 100, y);
      doc.text(`₹${item.price}`, 130, y);
      doc.text(`₹${item.total}`, 165, y);
      y += 10;
    });
    
    // Total
    doc.line(20, y, 190, y);
    y += 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Grand Total:", 120, y);
    doc.text(`₹${invoice.total}`, 165, y);
    
    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150);
    doc.text("Thank you for choosing dresscode laundry!", 105, 280, { align: "center" });

    doc.save(`invoice-${invoice.invoiceNumber}.pdf`);
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-gray-950">
      <DashboardNav />
      <main className="pt-14 md:pt-0 md:ml-64">
        <div className="p-4 md:p-6 lg:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">Invoices</h1>
              <p className="text-sm text-gray-400">View and manage customer billing</p>
            </div>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 rounded-xl">
              <Link href="/dashboard/invoices/new">
                <Plus className="h-4 w-4 mr-2" />
                Create
              </Link>
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoices..."
              className="pl-10 bg-gray-900 border-gray-800 text-white rounded-xl"
            />
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 bg-gray-900 rounded-xl" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-gray-900 rounded-2xl border border-red-900/50">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-400 text-lg font-medium">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4 border-red-900/50 text-red-400 hover:bg-red-950"
                onClick={fetchInvoices}
              >
                Try Again
              </Button>
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-20 bg-gray-900 rounded-2xl border border-gray-800">
              <FileText className="h-12 w-12 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-400">No invoices found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <Card key={invoice._id} className="bg-gray-900 border-gray-800 group hover:border-gray-700 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{invoice.invoiceNumber}</span>
                          <Badge className={
                            invoice.status === "paid" ? "bg-green-500/10 text-green-500" :
                            invoice.status === "sent" ? "bg-blue-500/10 text-blue-500" :
                            "bg-gray-500/10 text-gray-500"
                          }>
                            {invoice.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-300">{invoice.customer.name}</p>
                        <p className="text-xs text-gray-500">{new Date(invoice.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-2">
                        <span className="text-lg font-bold text-white">₹{invoice.total}</span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
                            onClick={() => handleDownloadPDF(invoice)}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {totalPages > 1 && !loading && !error && (
            <div className="flex justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="bg-gray-900 border-gray-800 text-white rounded-xl"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="bg-gray-900 border-gray-800 text-white rounded-xl"
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
