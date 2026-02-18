"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Package, MapPin, ArrowRight } from "lucide-react";
import { Footer } from "@/components/footer";

export default function TrackSearchPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      router.push(`/track/${orderNumber.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation variant="solid" />
      
      <main className="pt-32 pb-12 px-4 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Track Your Order</h1>
            <p className="text-gray-500 mt-2">Enter your order ID to see real-time updates</p>
          </div>

          <Card className="rounded-3xl border-none shadow-xl overflow-hidden bg-white">
            <CardContent className="p-8">
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Order Number</label>
                  <div className="relative group">
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    <Input 
                      placeholder="e.g. DC-123456"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      className="pl-12 h-14 bg-gray-50 border-gray-100 rounded-2xl focus:ring-emerald-500 focus:border-emerald-500 text-lg font-mono tracking-wider"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 ml-1">You can find this on your receipt or SMS.</p>
                </div>

                <Button 
                  type="submit"
                  size="lg"
                  className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-lg font-bold shadow-lg shadow-emerald-500/20"
                >
                  Track Order
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white p-4 rounded-2xl flex flex-col items-center text-center shadow-sm">
                <MapPin className="h-6 w-6 text-emerald-500 mb-2" />
                <span className="text-[10px] font-bold text-gray-400 uppercase">Live Updates</span>
             </div>
             <div className="bg-white p-4 rounded-2xl flex flex-col items-center text-center shadow-sm">
                <Search className="h-6 w-6 text-blue-500 mb-2" />
                <span className="text-[10px] font-bold text-gray-400 uppercase">Secure Access</span>
             </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
