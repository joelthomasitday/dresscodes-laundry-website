"use client";

import { useEffect, useState, use } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Phone,
  Truck,
  Shirt,
  Search
} from "lucide-react";
import Link from "next/link";
import { 
  ORDER_STATUS_LABELS, 
  ORDER_STATUS_COLORS, 
  getStatusProgress,
  type OrderStatus,
  ORDER_STATUSES
} from "@/lib/constants";

interface OrderTrackingData {
  orderNumber: string;
  customer: { name: string };
  status: OrderStatus;
  pickupDate: string;
  deliveryDate?: string;
  totalAmount: number;
  createdAt: string;
  statusHistory: { status: OrderStatus; timestamp: string; note?: string }[];
  services: { name: string; quantity: number }[];
}

export default function TrackOrderPage({ 
  params 
}: { 
  params: Promise<{ orderNumber: string }> 
}) {
  const { orderNumber } = use(params);
  const [order, setOrder] = useState<OrderTrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/track/${orderNumber}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
      } else {
        const err = await res.json();
        setError(err.error || "Order not found");
      }
    } catch (err) {
      setError("Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation variant="solid" />
      
      <main className="pt-24 pb-12 px-4 max-w-2xl mx-auto">
        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-40 w-full rounded-3xl" />
            <Skeleton className="h-64 w-full rounded-3xl" />
          </div>
        ) : error ? (
          <Card className="border-red-100 bg-red-50/30 text-center py-12 rounded-3xl">
            <Search className="h-12 w-12 text-red-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-900">{error}</h2>
            <p className="text-red-600 mt-2">Please check your order number and try again.</p>
            <Button asChild className="mt-6 bg-emerald-600 hover:bg-emerald-700 rounded-full">
              <Link href="/booking">New Booking</Link>
            </Button>
          </Card>
        ) : order ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Ticket */}
            <header className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white p-6 rounded-3xl shadow-xl shadow-emerald-900/10 relative overflow-hidden">
                <div className="relative z-10">
                  <Badge className="bg-white/20 text-white border-white/30 mb-2">
                    {order.orderNumber}
                  </Badge>
                  <h1 className="text-2xl font-bold">Track Your Order</h1>
                  <p className="text-emerald-100 text-sm mt-1">Hello, {order.customer.name}</p>
                </div>
                <Truck className="absolute -right-4 -bottom-4 h-24 w-24 text-white/10 rotate-12" />
            </header>

            {/* Current Status Card */}
            <Card className="rounded-3xl border-none shadow-md overflow-hidden">
               <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Current Status</p>
                      <h3 className="text-xl font-bold text-gray-900 mt-1">
                        {ORDER_STATUS_LABELS[order.status]}
                      </h3>
                    </div>
                    <Badge className={`${ORDER_STATUS_COLORS[order.status]} py-1.5 px-3 rounded-full text-[10px]`}>
                      {getStatusProgress(order.status)}% Completed
                    </Badge>
                  </div>

                  {/* Progress Line */}
                  <div className="relative pt-2">
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
                        style={{ width: `${getStatusProgress(order.status)}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-2">
                     <div className="flex items-center gap-2">
                        <div className="bg-blue-50 p-2 rounded-xl">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">Pickup Date</p>
                          <p className="text-xs font-bold text-gray-700">{new Date(order.pickupDate).toLocaleDateString()}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="bg-purple-50 p-2 rounded-xl">
                          <Package className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">Services</p>
                          <p className="text-xs font-bold text-gray-700">{order.services.length} items</p>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* Status Timeline */}
            <Card className="rounded-3xl border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-gray-900">Activity History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-0 px-6 pb-8">
                {ORDER_STATUSES.map((status, idx) => {
                  const history = order.statusHistory.find(h => h.status === status);
                  const isDone = ORDER_STATUSES.indexOf(order.status) >= idx;
                  const isLatest = order.status === status;

                  return (
                    <div key={status} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 transition-colors duration-500 ${
                          isDone ? "bg-emerald-500 shadow-lg shadow-emerald-500/20" : "bg-gray-100"
                        }`}>
                          {isDone ? (
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          ) : (
                            <div className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                          )}
                        </div>
                        {idx < ORDER_STATUSES.length - 1 && (
                          <div className={`w-0.5 h-12 -my-1 ${isDone ? "bg-emerald-500/30" : "bg-gray-100"}`} />
                        )}
                      </div>
                      <div className="pt-1.5">
                        <h4 className={`text-sm font-bold transition-colors ${isDone ? "text-gray-900" : "text-gray-300"}`}>
                          {ORDER_STATUS_LABELS[status]}
                        </h4>
                        {history && (
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(history.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <div className="text-center pt-4">
               <p className="text-xs text-gray-400">If you have any questions, please contact our support.</p>
               <Button asChild variant="outline" className="mt-4 rounded-full border-gray-200 text-gray-600 hover:text-emerald-600">
                  <Link href="/services">View Other Services</Link>
               </Button>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
