"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboardAuth } from "@/contexts/dashboard-auth-context";
import { DashboardNav } from "@/components/dashboard-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    address: ""
  });
  
  const [items, setItems] = useState<InvoiceItem[]>([
    { name: "", qty: 1, price: 0, total: 0 }
  ]);

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = Math.round(subtotal * 0.05); // 5% tax
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
          total
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
    <div className="min-h-screen bg-gray-950">
      <DashboardNav />
      <main className="pt-14 md:pt-0 md:ml-64">
        <div className="p-4 md:p-6 lg:p-8 space-y-6">
          <Link href="/dashboard/invoices" className="inline-flex items-center text-sm text-gray-400 hover:text-emerald-400">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Invoices
          </Link>

          <header>
            <h1 className="text-xl md:text-2xl font-bold text-white">New Invoice</h1>
            <p className="text-sm text-gray-400">Create a manual invoice for a customer</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl pb-20">
            {/* Customer Details */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg text-white">Customer Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-400">Customer Name</Label>
                  <Input 
                    required
                    className="bg-gray-800 border-gray-700 text-white rounded-xl"
                    value={customer.name}
                    onChange={(e) => setCustomer({...customer, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-400">Phone Number</Label>
                  <Input 
                    required
                    className="bg-gray-800 border-gray-700 text-white rounded-xl"
                    value={customer.phone}
                    onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-gray-400">Address (Optional)</Label>
                  <Input 
                    className="bg-gray-800 border-gray-700 text-white rounded-xl"
                    value={customer.address}
                    onChange={(e) => setCustomer({...customer, address: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Invoice Items */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg text-white">Items</CardTitle>
                <Button type="button" onClick={addItem} variant="outline" size="sm" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 rounded-lg">
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-3 items-end">
                    <div className="col-span-12 md:col-span-5 space-y-1">
                      <Label className="text-xs text-gray-500">Service Name</Label>
                      <Input 
                        required
                        placeholder="e.g. Wash & Fold"
                        className="bg-gray-800 border-gray-700 text-white rounded-xl h-10"
                        value={item.name}
                        onChange={(e) => updateItem(idx, "name", e.target.value)}
                      />
                    </div>
                    <div className="col-span-4 md:col-span-2 space-y-1">
                      <Label className="text-xs text-gray-500">Qty</Label>
                      <Input 
                        type="number"
                        className="bg-gray-800 border-gray-700 text-white rounded-xl h-10"
                        value={item.qty}
                        onChange={(e) => updateItem(idx, "qty", e.target.value)}
                      />
                    </div>
                    <div className="col-span-4 md:col-span-2 space-y-1">
                      <Label className="text-xs text-gray-500">Price</Label>
                      <Input 
                        type="number"
                        className="bg-gray-800 border-gray-700 text-white rounded-xl h-10"
                        value={item.price}
                        onChange={(e) => updateItem(idx, "price", e.target.value)}
                      />
                    </div>
                    <div className="col-span-4 md:col-span-2 space-y-1">
                      <Label className="text-xs text-gray-500">Total</Label>
                      <div className="h-10 flex items-center px-3 bg-gray-800/50 text-white font-bold rounded-xl text-sm">
                        ₹{item.total}
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-1">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="text-gray-500 hover:text-red-500"
                        onClick={() => removeItem(idx)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="pt-6 border-t border-gray-800 space-y-2">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>GST (5%)</span>
                    <span>₹{tax}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-white pt-2">
                    <span>Total Amount</span>
                    <span className="text-emerald-400">₹{total}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-700/20"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5 mr-2" />}
              Save Invoice
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
