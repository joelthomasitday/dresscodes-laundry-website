"use client";

import { useState, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { pricingData } from "@/lib/pricing-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronRight, Zap, Sparkles, Waves, Crown, ArrowRight, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/footer";

export default function PricingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...Object.keys(pricingData)];

  const filteredData = useMemo(() => {
    let result: Record<string, any[]> = {};
    
    Object.entries(pricingData).forEach(([category, items]) => {
      if (selectedCategory !== "All" && category !== selectedCategory) return;
      
      const filteredItems = items.filter(item => 
        item.Item.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (filteredItems.length > 0) {
        result[category] = filteredItems;
      }
    });
    
    return result;
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <Navigation variant="solid" />

      {/* Hero Section */}
      <section className="pt-32 pb-32 bg-emerald-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-800/30 skew-x-12 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <Badge className="bg-emerald-500/20 text-emerald-200 border-emerald-500/30 mb-6 px-4 py-1.5 rounded-full text-sm font-bold tracking-wider">
            TRANSPARENT PRICING
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Premium Care, <span className="text-emerald-400">Simple Rates</span>
          </h1>
          <p className="text-lg text-emerald-100/70 max-w-2xl mx-auto leading-relaxed">
            High-quality laundry and dry cleaning with no hidden fees. 
            Choose your service and see exactly what you pay.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-16 md:-mt-24 relative z-20">
        {/* Main Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { title: "Wash & Iron", price: "₹160", unit: "per Kg", icon: <Waves className="h-6 w-6" />, color: "bg-blue-500" },
            { title: "Dry Clean", price: "₹100", unit: "from / Pc", icon: <Sparkles className="h-6 w-6" />, color: "bg-emerald-500" },
            { title: "Ironing", price: "₹20", unit: "per Pc", icon: <Zap className="h-6 w-6" />, color: "bg-amber-500" },
            { title: "Premium", price: "₹220", unit: "per Kg", icon: <Crown className="h-6 w-6" />, color: "bg-purple-500" },
          ].map((s, i) => (
            <Card key={i} className="relative rounded-[32px] border-none shadow-xl bg-white overflow-hidden hover:scale-105 transition-all duration-300 hover:z-30">
              <CardContent className="p-8 text-center">
                <div className={cn("inline-flex p-4 rounded-3xl text-white mb-4 shadow-lg", s.color)}>
                  {s.icon}
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-1 uppercase tracking-tight">{s.title}</h3>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black text-emerald-800">{s.price}</span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{s.unit}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white/70 backdrop-blur-xl p-4 sm:p-6 rounded-[32px] shadow-sm border border-white mb-8 sticky top-20 z-30 flex flex-col md:flex-row gap-6 items-center">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
              placeholder="Search items (e.g. Saree, Suit, Curtain)..." 
              className="pl-12 h-14 rounded-2xl bg-gray-50/50 border-gray-100 focus:ring-emerald-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto w-full md:flex-1 pb-2 md:pb-0 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap",
                  selectedCategory === cat 
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-105" 
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Price List Content */}
        <div className="space-y-12">
          {Object.entries(filteredData).map(([category, items]) => (
            <div key={category} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{category}</h2>
                <div className="h-px bg-gray-200 flex-1" />
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 font-bold px-3">
                  {items.length} Items
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                  <Card key={item.SNo} className="border-none shadow-sm hover:shadow-md transition-all group rounded-2xl bg-white overflow-hidden">
                    <CardContent className="p-5 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-gray-800 uppercase tracking-tight group-hover:text-emerald-700 transition-colors">
                          {item.Item}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">DRY CLEANING</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-emerald-800">₹{item.Price}</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase">Per Piece</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          {Object.keys(filteredData).length === 0 && (
            <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <Search className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">No items found</h3>
              <p className="text-gray-500">Try searching for something else or change the category.</p>
              <Button 
                variant="ghost" 
                className="mt-4 text-emerald-600 font-bold"
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>

        {/* Final CTA */}
        <section className="mt-20">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-900 rounded-[40px] p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-emerald-200/50">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 flex pointer-events-none">
              <Zap className="h-64 w-64 -translate-x-32 -translate-y-32" />
              <div className="flex-1" />
              <Sparkles className="h-64 w-64 translate-x-32 translate-y-32" />
            </div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight leading-none">
                Get Your Clothes Looking New Again
              </h2>
              <p className="text-emerald-100 text-lg mb-10 opacity-80">
                Schedule your free pickup today and join 5000+ happy customers in Kottayam.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="h-16 px-10 rounded-full bg-white text-emerald-900 hover:bg-emerald-50 font-black text-lg shadow-xl shadow-black/10">
                  <Link href="/booking">Schedule Free Pickup <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-16 px-10 rounded-full border-2 border-white/30 hover:bg-white/10 text-white font-black text-lg bg-transparent">
                  <Link href="/contact">Talk to Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t pt-20">
        {[
          { label: "Free Pickup", sub: "Above ₹500", icon: <MapPin className="h-5 w-5" /> },
          { label: "24-48 Hours", sub: "Standard delivery", icon: <Clock className="h-5 w-5" /> },
          { label: "Safe Handling", sub: "Premium solvents", icon: <Waves className="h-5 w-5" /> },
          { label: "Doorstep App", sub: "Track real-time", icon: <Zap className="h-5 w-5" /> },
        ].map((s, i) => (
          <div key={i} className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              {s.icon}
            </div>
            <div>
              <p className="font-black text-gray-900 uppercase text-xs tracking-widest">{s.label}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
