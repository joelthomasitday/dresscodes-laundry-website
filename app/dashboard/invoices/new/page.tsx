"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboardAuth } from "@/contexts/dashboard-auth-context";
import { DashboardNav, MobilePageHeader } from "@/components/dashboard-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Trash2, Loader2, Save } from "lucide-react";
import Link from "next/link";

interface InvoiceItem {
  name: string;
  qty: number;
  price: number;
  total: number;
}

export default function NewInvoicePage() {
  const { isAuthenticated, isLoading: authLoading } = useDashboardAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { name: "", qty: 1, price: 0, total: 0 },
  ]);

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  const addItem = () => {
    setItems([...items, { name: "", qty: 1, price: 0, total: 0 }]);
  };

  const removeItem = (idx: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== idx));
    }
  };

  const updateItem = (idx: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    const item = { ...newItems[idx] };

    if (field === "name") item.name = value;
    if (field === "qty") item.qty = parseInt(value) || 0;
    if (field === "price") item.price = parseInt(value) || 0;

    item.total = item.qty * item.price;
    newItems[idx] = item;
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name || !customer.phone) return;

    setLoading(true);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          items,
          subtotal,
          tax,
          discount: 0,
          total,
        }),
      });

      if (res.ok) {
        router.push("/dashboard/invoices");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/80 via-white to-white">
      <MobilePageHeader title="New Invoice" backHref="/dashboard/invoices" />
      <DashboardNav />

      <main className="pt-16 pb-24 md:pt-0 md:ml-64 md:pb-8">
        <div className="p-5 md:p-6 lg:p-8 space-y-5 max-w-lg mx-auto md:max-w-3xl">
          {/* Desktop back */}
          <Link
            href="/dashboard/invoices"
            className="hidden md:inline-flex items-center text-sm text-gray-400 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Invoices
          </Link>

          <div className="hidden md:block">
            <h1 className="text-xl font-bold text-gray-800">New Invoice</h1>
            <p className="text-sm text-gray-400">
              Create a manual invoice for a customer
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 pb-6">
            {/* Customer Details */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-sm font-bold text-gray-800 mb-4">
                Customer Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-500 text-xs font-medium">
                    Customer Name
                  </Label>
                  <Input
                    required
                    className="bg-gray-50 border-gray-200 text-gray-800 rounded-xl h-11 focus:border-emerald-400"
                    value={customer.name}
                    onChange={(e) =>
                      setCustomer({ ...customer, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-500 text-xs font-medium">
                    Phone Number
                  </Label>
                  <Input
                    required
                    className="bg-gray-50 border-gray-200 text-gray-800 rounded-xl h-11 focus:border-emerald-400"
                    value={customer.phone}
                    onChange={(e) =>
                      setCustomer({ ...customer, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-gray-500 text-xs font-medium">
                    Address (Optional)
                  </Label>
                  <Input
                    className="bg-gray-50 border-gray-200 text-gray-800 rounded-xl h-11 focus:border-emerald-400"
                    value={customer.address}
                    onChange={(e) =>
                      setCustomer({ ...customer, address: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-gray-800">Items</h2>
                <Button
                  type="button"
                  onClick={addItem}
                  variant="outline"
                  size="sm"
                  className="bg-gray-50 border-gray-200 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-full text-xs"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add
                </Button>
              </div>

              <div className="space-y-4">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-12 gap-3 items-end"
                  >
                    <div className="col-span-12 md:col-span-5 space-y-1">
                      <Label className="text-xs text-gray-400">
                        Service Name
                      </Label>
                      <Input
                        required
                        placeholder="e.g. Wash & Fold"
                        className="bg-gray-50 border-gray-200 text-gray-800 rounded-xl h-10 focus:border-emerald-400"
                        value={item.name}
                        onChange={(e) =>
                          updateItem(idx, "name", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-4 md:col-span-2 space-y-1">
                      <Label className="text-xs text-gray-400">Qty</Label>
                      <Input
                        type="number"
                        className="bg-gray-50 border-gray-200 text-gray-800 rounded-xl h-10 focus:border-emerald-400"
                        value={item.qty}
                        onChange={(e) =>
                          updateItem(idx, "qty", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-4 md:col-span-2 space-y-1">
                      <Label className="text-xs text-gray-400">Price</Label>
                      <Input
                        type="number"
                        className="bg-gray-50 border-gray-200 text-gray-800 rounded-xl h-10 focus:border-emerald-400"
                        value={item.price}
                        onChange={(e) =>
                          updateItem(idx, "price", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-3 md:col-span-2 space-y-1">
                      <Label className="text-xs text-gray-400">Total</Label>
                      <div className="h-10 flex items-center px-3 bg-emerald-50/50 text-emerald-700 font-bold rounded-xl text-sm border border-emerald-100">
                        ₹{item.total}
                      </div>
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl"
                        onClick={() => removeItem(idx)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>GST (5%)</span>
                    <span>₹{tax}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-800 pt-2">
                    <span>Total Amount</span>
                    <span className="text-emerald-600">₹{total}</span>
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Save className="h-5 w-5 mr-2" />
              )}
              Save Invoice
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
