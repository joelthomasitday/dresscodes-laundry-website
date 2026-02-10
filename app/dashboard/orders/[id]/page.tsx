"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useDashboardAuth } from "@/contexts/dashboard-auth-context";
import { DashboardNav } from "@/components/dashboard-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Phone,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  getNextStatus,
  getStatusProgress,
  type OrderStatus,
} from "@/lib/constants";

interface OrderDetail {
  _id: string;
  orderNumber: string;
  customer: { name: string; phone: string; email?: string; address: string };
  services: { name: string; quantity: number; price: number; weight?: number }[];
  status: OrderStatus;
  pickupDate: string;
  pickupTimeSlot: string;
  deliveryDate?: string;
  totalAmount: number;
  notes?: string;
  assignedRider?: string;
  assignedStaff?: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    updatedBy?: string;
    note?: string;
  }[];
  createdAt: string;
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user, isAuthenticated, isLoading: authLoading } = useDashboardAuth();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [riders, setRiders] = useState<{ _id: string; name: string }[]>([]);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/dashboard/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && id) {
      fetchOrder();
      if (user?.role === "admin") {
        fetchRiders();
      }
    }
  }, [isAuthenticated, id, user?.role]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (res.ok) {
        const json = await res.json();
        setOrder(json.order);
      }
    } catch (err) {
      console.error("Failed to fetch order:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRiders = async () => {
    try {
      const res = await fetch("/api/riders");
      if (res.ok) {
        const json = await res.json();
        setRiders(json.riders);
      }
    } catch (err) {
      console.error("Failed to fetch riders:", err);
    }
  };

  const handleRiderAssignment = async (riderId: string) => {
    setAssigning(true);
    try {
      // Use null to clear the assignment in the DB if riderId is empty
      const targetRiderId = riderId || null;

      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedRider: targetRiderId }),
      });

      if (res.ok && riderId) {
        // Only create a rider task automatically if we are assigning (not removing)
        await fetch(`/api/rider-tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            riderId,
            orderId: id,
            orderNumber: order?.orderNumber,
            type: "pickup",
            customer: order?.customer,
          }),
        });
      }
      
      if (res.ok) {
        await fetchOrder();
        toast.success(riderId ? "Rider assigned" : "Rider removed");
      }
    } catch (err) {
      console.error("Failed to assign rider:", err);
      toast.error("Failed to update assignment");
    } finally {
      setAssigning(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!order) return;
    const next = getNextStatus(order.status);
    if (!next) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (res.ok) {
        await fetchOrder();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <div className="md:ml-64 p-4 md:p-6 lg:p-8 space-y-6">
          <Skeleton className="h-6 w-32 bg-gray-900 rounded-full" />
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48 bg-gray-900" />
              <Skeleton className="h-4 w-32 bg-gray-900" />
            </div>
            <Skeleton className="h-7 w-24 bg-gray-900 rounded-full" />
          </div>
          <Skeleton className="h-16 w-full bg-gray-900 rounded-xl" />
          <Skeleton className="h-48 w-full bg-gray-900 rounded-xl" />
          <Skeleton className="h-64 w-full bg-gray-900 rounded-xl" />
        </div>
      </div>
    );
  }
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-950">
      <DashboardNav />

      <main className="pt-14 md:pt-0 md:ml-64">
        <div className="p-4 md:p-6 lg:p-8 space-y-4 pb-32 md:pb-8">
          {/* Back button */}
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>

          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-48 bg-gray-900" />
              <Skeleton className="h-40 bg-gray-900 rounded-xl" />
              <Skeleton className="h-32 bg-gray-900 rounded-xl" />
            </div>
          ) : !order ? (
            <div className="text-center py-16">
              <p className="text-gray-400">Order not found</p>
            </div>
          ) : (
            <>
              {/* Order header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-white">
                    {order.orderNumber}
                  </h1>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Created{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <Badge
                  className={`${ORDER_STATUS_COLORS[order.status]} text-xs px-3 py-1`}
                >
                  {ORDER_STATUS_LABELS[order.status]}
                </Badge>
              </div>

              {/* Progress bar */}
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">Progress</span>
                  <span className="text-xs text-emerald-400 font-medium">
                    {getStatusProgress(order.status)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${getStatusProgress(order.status)}%` }}
                  />
                </div>
              </div>

              {/* Customer Info */}
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-4 space-y-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                    Customer
                  </p>
                  <p className="text-base font-semibold text-white">
                    {order.customer.name}
                  </p>

                  <div className="space-y-2">
                    <a
                      href={`tel:${order.customer.phone}`}
                      className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 py-1"
                    >
                      <Phone className="h-4 w-4" />
                      {order.customer.phone}
                    </a>
                    <div className="flex items-start gap-2 text-sm text-gray-400">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{order.customer.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Pickup:{" "}
                        {new Date(order.pickupDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        • {order.pickupTimeSlot}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rider Assignment (Admin Only) */}
              {user?.role === "admin" && (
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                        {order.assignedRider ? "Assigned Rider" : "Assign Rider"}
                      </p>
                      {assigning && <Loader2 className="h-3 w-3 animate-spin text-emerald-500" />}
                    </div>
                    
                    <div className="space-y-3">
                      {order.assignedRider ? (
                        <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-xl border border-gray-700">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
                              <Truck className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">
                                {riders.find(r => r._id === order.assignedRider)?.name || "Assigned"}
                              </p>
                              <p className="text-xs text-gray-500">Active Rider</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRiderAssignment("")}
                            className="text-xs text-red-400 hover:text-red-300 hover:bg-red-400/10"
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {riders.length > 0 ? (
                            riders.map((rider) => (
                              <button
                                key={rider._id}
                                onClick={() => handleRiderAssignment(rider._id)}
                                disabled={assigning}
                                className="flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition-all text-left"
                              >
                                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-gray-400">
                                  {rider.name.charAt(0)}
                                </div>
                                <span className="text-sm font-medium text-white">
                                  {rider.name}
                                </span>
                              </button>
                            ))
                          ) : (
                            <p className="text-xs text-gray-500 col-span-2 py-2">No riders available</p>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Services */}
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-3">
                    Services
                  </p>
                  <div className="space-y-2">
                    {order.services.map((s, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0"
                      >
                        <div>
                          <p className="text-sm text-white font-medium">{s.name}</p>
                          <p className="text-xs text-gray-500">
                            Qty: {s.quantity}
                            {s.weight ? ` • ${s.weight}kg` : ""}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-white">
                          ₹{s.price * s.quantity}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm font-bold text-gray-300">
                        Total
                      </span>
                      <span className="text-lg font-bold text-emerald-400">
                        ₹{order.totalAmount}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status Timeline */}
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-4">
                    Status Timeline
                  </p>
                  <div className="space-y-0">
                    {ORDER_STATUSES.map((status, idx) => {
                      const historyEntry = order.statusHistory.find(
                        (h) => h.status === status
                      );
                      const currentIdx = ORDER_STATUSES.indexOf(order.status);
                      const isCompleted = idx <= currentIdx;
                      const isCurrent = status === order.status;

                      return (
                        <div key={status} className="flex gap-3">
                          {/* Line + dot */}
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isCompleted
                                  ? "bg-emerald-500 text-white"
                                  : "bg-gray-800 text-gray-600"
                              } ${isCurrent ? "ring-2 ring-emerald-400/50" : ""}`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : (
                                <span className="w-2 h-2 rounded-full bg-gray-600" />
                              )}
                            </div>
                            {idx < ORDER_STATUSES.length - 1 && (
                              <div
                                className={`w-0.5 h-8 ${
                                  idx < currentIdx
                                    ? "bg-emerald-500"
                                    : "bg-gray-800"
                                }`}
                              />
                            )}
                          </div>

                          {/* Content */}
                          <div className="pb-6">
                            <p
                              className={`text-sm font-medium ${
                                isCompleted ? "text-white" : "text-gray-600"
                              }`}
                            >
                              {ORDER_STATUS_LABELS[status]}
                            </p>
                            {historyEntry && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                {new Date(historyEntry.timestamp).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                                {historyEntry.updatedBy &&
                                  ` • by ${historyEntry.updatedBy}`}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              {order.notes && (
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                      Notes
                    </p>
                    <p className="text-sm text-gray-300">{order.notes}</p>
                  </CardContent>
                </Card>
              )}

              {/* Sticky bottom action bar */}
              {order.status !== "DELIVERED" && (user?.role === "admin" || user?.role === "staff") && (
                <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-gray-900/90 backdrop-blur-xl border-t border-gray-800 p-4 z-30">
                  <Button
                    onClick={handleStatusUpdate}
                    disabled={updating}
                    className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl text-base shadow-lg shadow-emerald-600/20"
                  >
                    {updating ? (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : (
                      <ChevronRight className="h-5 w-5 mr-2" />
                    )}
                    Move to: {ORDER_STATUS_LABELS[getNextStatus(order.status)!]}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
