"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useDashboardAuth } from "@/contexts/dashboard-auth-context";
import { DashboardNav, MobilePageHeader } from "@/components/dashboard-nav";
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
  FileText,
  Circle,
  Settings,
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
  services: {
    name: string;
    quantity: number;
    price: number;
    weight?: number;
  }[];
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
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
  } = useDashboardAuth();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [riders, setRiders] = useState<{ _id: string; name: string }[]>([]);
  const [assigning, setAssigning] = useState(false);
  const [generatingInvoice, setGeneratingInvoice] = useState(false);

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
      const targetRiderId = riderId || null;

      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedRider: targetRiderId }),
      });

      if (res.ok && riderId) {
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

  const handleGenerateInvoice = async () => {
    if (!order) return;
    setGeneratingInvoice(true);
    try {
      const items = order.services.map((s) => ({
        name: s.name,
        qty: s.quantity,
        price: s.price,
        total: s.quantity * s.price,
      }));

      const subtotal = items.reduce((sum, item) => sum + item.total, 0);
      const tax = 0;
      const total = order.totalAmount;

      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: order.customer,
          items,
          subtotal,
          tax,
          discount: 0,
          total,
          orderId: order._id,
        }),
      });

      if (res.ok) {
        toast.success("Invoice generated successfully");
        router.push("/dashboard/invoices");
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to generate invoice");
      }
    } catch (err) {
      console.error("Failed to generate invoice:", err);
      toast.error("An error occurred");
    } finally {
      setGeneratingInvoice(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50/80 via-white to-white">
        <div className="p-5 pt-20 space-y-4 max-w-lg mx-auto">
          <Skeleton className="h-5 w-32 bg-gray-100 rounded-full" />
          <Skeleton className="h-8 w-48 bg-gray-100 rounded-xl" />
          <Skeleton className="h-16 w-full bg-gray-100 rounded-2xl" />
          <Skeleton className="h-40 w-full bg-gray-100 rounded-2xl" />
          <Skeleton className="h-64 w-full bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/80 via-white to-white">
      <MobilePageHeader
        title={order?.orderNumber || "Order Details"}
        backHref="/dashboard/orders"
        rightSlot={
          user?.role === "admin" ? (
            <button
              onClick={handleGenerateInvoice}
              disabled={generatingInvoice}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              {generatingInvoice ? (
                <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
              ) : (
                <FileText className="h-5 w-5 text-gray-600" />
              )}
            </button>
          ) : undefined
        }
      />
      <DashboardNav />

      <main className="pt-16 pb-28 md:pt-0 md:ml-64 md:pb-8">
        <div className="p-5 md:p-6 lg:p-8 space-y-4 max-w-lg mx-auto md:max-w-none">
          {/* Desktop back */}
          <Link
            href="/dashboard/orders"
            className="hidden md:inline-flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>

          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-48 bg-gray-100 rounded-xl" />
              <Skeleton className="h-40 bg-gray-100 rounded-2xl" />
              <Skeleton className="h-32 bg-gray-100 rounded-2xl" />
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
                  <h1 className="text-xl font-bold text-gray-800">
                    {order.orderNumber}
                  </h1>
                  <p className="text-xs text-gray-400 mt-0.5">
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
                <div className="flex items-center gap-2">
                  <Badge
                    className={`${
                      ORDER_STATUS_COLORS[order.status]
                    } text-xs px-3 py-1 rounded-full`}
                  >
                    {ORDER_STATUS_LABELS[order.status]}
                  </Badge>
                  {user?.role === "admin" && (
                    <Button
                      onClick={handleGenerateInvoice}
                      disabled={generatingInvoice}
                      variant="outline"
                      size="sm"
                      className="hidden md:flex bg-white border-gray-200 text-gray-600 hover:bg-gray-50 rounded-full"
                    >
                      {generatingInvoice ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <FileText className="h-4 w-4 mr-2" />
                      )}
                      Invoice
                    </Button>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500 font-medium">
                    Progress
                  </span>
                  <span className="text-xs text-emerald-600 font-semibold">
                    {getStatusProgress(order.status)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${getStatusProgress(order.status)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
                  Customer
                </p>
                <p className="text-base font-semibold text-gray-800">
                  {order.customer.name}
                </p>

                <div className="space-y-2.5">
                  <a
                    href={`tel:${order.customer.phone}`}
                    className="flex items-center gap-2.5 text-sm text-emerald-600 hover:text-emerald-700 py-1 transition-colors"
                  >
                    <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center">
                      <Phone className="h-4 w-4" />
                    </div>
                    {order.customer.phone}
                  </a>
                  <div className="flex items-start gap-2.5 text-sm text-gray-500">
                    <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-4 w-4 text-gray-400" />
                    </div>
                    <span className="pt-1.5">{order.customer.address}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-gray-500">
                    <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <span>
                      Pickup:{" "}
                      {new Date(order.pickupDate).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}{" "}
                      • {order.pickupTimeSlot}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rider Assignment (Admin Only) */}
              {user?.role === "admin" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
                      {order.assignedRider
                        ? "Assigned Rider"
                        : "Assign Rider"}
                    </p>
                    {assigning && (
                      <Loader2 className="h-3 w-3 animate-spin text-emerald-500" />
                    )}
                  </div>

                  <div className="space-y-3">
                    {order.assignedRider ? (
                      <div className="flex items-center justify-between bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                            <Truck className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {riders.find(
                                (r) => r._id === order.assignedRider
                              )?.name || "Assigned"}
                            </p>
                            <p className="text-xs text-gray-400">
                              Active Rider
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRiderAssignment("")}
                          className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
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
                              onClick={() =>
                                handleRiderAssignment(rider._id)
                              }
                              disabled={assigning}
                              className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-emerald-50 rounded-2xl border border-gray-100 transition-all text-left active:scale-[0.98]"
                            >
                              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-500 shadow-sm">
                                {rider.name.charAt(0)}
                              </div>
                              <span className="text-sm font-medium text-gray-700">
                                {rider.name}
                              </span>
                            </button>
                          ))
                        ) : (
                          <p className="text-xs text-gray-400 col-span-2 py-2">
                            No riders available
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Services */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-3">
                  Services
                </p>
                <div className="space-y-2">
                  {order.services.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
                    >
                      <div>
                        <p className="text-sm text-gray-800 font-medium">
                          {s.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          Qty: {s.quantity}
                          {s.weight ? ` • ${s.weight}kg` : ""}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">
                        ₹{s.price * s.quantity}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-sm font-bold text-gray-600">
                      Total
                    </span>
                    <span className="text-lg font-bold text-emerald-600">
                      ₹{order.totalAmount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-4">
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
                            className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                              isCompleted
                                ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/30"
                                : "bg-gray-100 text-gray-300"
                            } ${
                              isCurrent
                                ? "ring-2 ring-emerald-200 ring-offset-2"
                                : ""
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <Circle className="h-3 w-3" />
                            )}
                          </div>
                          {idx < ORDER_STATUSES.length - 1 && (
                            <div
                              className={`w-0.5 h-8 ${
                                idx < currentIdx
                                  ? "bg-emerald-500"
                                  : "bg-gray-100"
                              }`}
                            />
                          )}
                        </div>

                        {/* Content */}
                        <div className="pb-6">
                          <p
                            className={`text-sm font-medium ${
                              isCompleted ? "text-gray-800" : "text-gray-300"
                            }`}
                          >
                            {ORDER_STATUS_LABELS[status]}
                          </p>
                          {historyEntry && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {new Date(
                                historyEntry.timestamp
                              ).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                              {historyEntry.updatedBy &&
                                ` • by ${historyEntry.updatedBy}`}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2">
                    Notes
                  </p>
                  <p className="text-sm text-gray-600">{order.notes}</p>
                </div>
              )}

              {/* Sticky bottom action bar */}
              {order.status !== "DELIVERED" &&
                (user?.role === "admin" || user?.role === "staff") && (
                  <div className="fixed bottom-16 md:bottom-0 left-0 right-0 md:left-64 bg-white/90 backdrop-blur-xl border-t border-gray-100 p-4 z-30">
                    <Button
                      onClick={handleStatusUpdate}
                      disabled={updating}
                      className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-2xl text-base shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all"
                    >
                      {updating ? (
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      ) : (
                        <ChevronRight className="h-5 w-5 mr-2" />
                      )}
                      Move to:{" "}
                      {ORDER_STATUS_LABELS[getNextStatus(order.status)!]}
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
