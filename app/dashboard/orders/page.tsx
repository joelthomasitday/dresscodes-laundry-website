"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDashboardAuth } from "@/contexts/dashboard-auth-context";
import { DashboardNav, MobilePageHeader } from "@/components/dashboard-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Phone,
  CheckCircle2,
  Circle,
  Shirt,
} from "lucide-react";
import Link from "next/link";
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  type OrderStatus,
} from "@/lib/constants";

interface OrderListItem {
  _id: string;
  orderNumber: string;
  customer: { name: string; phone: string; address: string };
  status: OrderStatus;
  totalAmount: number;
  pickupDate: string;
  pickupTimeSlot: string;
  createdAt: string;
  services: { name: string; quantity: number }[];
  deliveryDate?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Simplified status step indicators for order cards */
const STATUS_STEPS = ["CREATED", "PICKED_UP", "IN_LAUNDRY", "DELIVERED"] as const;
const STATUS_STEP_LABELS = ["Ordered", "Picked Up", "Handover", "Delivered"];

function OrdersPageContent() {
  const { isAuthenticated, isLoading: authLoading } = useDashboardAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "all"
  );

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/dashboard/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, statusFilter, pagination.page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: "20",
      });
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search) params.set("search", search);

      const res = await fetch(`/api/orders?${params}`);
      if (res.ok) {
        const json = await res.json();
        setOrders(json.orders);
        setPagination(json.pagination);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((p) => ({ ...p, page: 1 }));
    fetchOrders();
  };

  /** Check if a status step is completed for a given order status */
  const isStepCompleted = (orderStatus: OrderStatus, stepStatus: string) => {
    const orderIdx = ORDER_STATUSES.indexOf(orderStatus);
    const stepIdx = ORDER_STATUSES.indexOf(stepStatus as OrderStatus);
    return orderIdx >= stepIdx;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50/80 via-white to-white">
        <div className="p-5 pt-20 space-y-4 max-w-lg mx-auto">
          <Skeleton className="h-6 w-40 bg-emerald-100/50 rounded-xl" />
          <Skeleton className="h-11 w-full bg-gray-100 rounded-2xl" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton
                key={i}
                className="h-9 w-24 bg-gray-100 rounded-full flex-shrink-0"
              />
            ))}
          </div>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 bg-gray-100 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }
  if (!isAuthenticated) return null;

  // Filter pills config
  const filterPills = [
    { value: "all", label: "All orders" },
    { value: "IN_LAUNDRY", label: "Processing" },
    { value: "DELIVERED", label: "Completed" },
    { value: "CREATED", label: "New" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/80 via-white to-white">
      {/* Custom header for Orders page */}
      <MobilePageHeader title="Order History" backHref="/dashboard" />
      <DashboardNav />

      <main className="pt-16 pb-24 md:pt-0 md:ml-64 md:pb-8">
        <div className="p-5 pt-3 md:p-6 lg:p-8 space-y-4 max-w-lg mx-auto md:max-w-none">
          {/* Desktop header */}
          <div className="hidden md:block">
            <h1 className="text-xl font-bold text-gray-800">Order History</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {pagination.total} total orders
            </p>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID or customer..."
              className="w-full pl-11 pr-4 h-14 bg-white/70 backdrop-blur-md border border-gray-100 text-gray-800 rounded-3xl placeholder:text-gray-400 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all shadow-sm"
            />
          </form>

          {/* Filter pills */}
          <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-5 px-5 md:mx-0 md:px-0 scrollbar-hide">
            {filterPills.map((pill) => (
              <button
                key={pill.value}
                onClick={() => {
                  setStatusFilter(pill.value);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                className={`flex-shrink-0 px-6 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
                  statusFilter === pill.value
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-105"
                    : "bg-white/80 text-gray-500 border border-gray-100 hover:bg-white hover:border-emerald-200"
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Order Cards */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 bg-gray-100/50 rounded-3xl" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No orders found</p>
              <p className="text-gray-400 text-xs mt-1">
                {statusFilter !== "all"
                  ? "Try changing the filter"
                  : "Orders placed will appear here"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-5 md:p-6"
                >
                  {/* Card header */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-bold text-gray-900 leading-none">
                            Order {order.orderNumber}
                          </h3>
                          <Badge
                            className={`${
                              ORDER_STATUS_COLORS[order.status]
                            } text-[10px] rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider border-none shadow-sm`}
                          >
                            {ORDER_STATUS_LABELS[order.status]}
                          </Badge>
                        </div>
                        <p className="text-xs font-medium text-gray-400 italic">
                          Placed on{" "}
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      
                      <Link
                        href={`/dashboard/orders/${order._id}`}
                        className="flex-shrink-0 text-[11px] font-bold text-emerald-700 bg-emerald-50/50 border border-emerald-100 rounded-2xl px-4 py-2 hover:bg-emerald-100 transition-all active:scale-95 shadow-sm"
                      >
                        Track Order
                      </Link>
                    </div>

                    {/* Service info */}
                    <div className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-2xl">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Shirt className="h-6 w-6 text-emerald-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">
                          {order.services?.[0]?.name || "Laundry Service"}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                          {order.services.reduce((acc, s) => acc + s.quantity, 0)}{" "}
                          items • ₹{order.totalAmount}
                        </p>
                      </div>
                    </div>

                    {/* Step indicator */}
                    <div className="pt-2">
                      <div className="flex items-center w-full">
                        {STATUS_STEPS.map((step, idx) => {
                          const completed = isStepCompleted(order.status, step);
                          return (
                            <div
                              key={step}
                              className="flex flex-col items-center flex-1"
                            >
                              <div className="flex items-center w-full">
                                {idx > 0 && (
                                  <div
                                    className={`flex-1 h-[3px] rounded-full ${
                                      completed
                                        ? "bg-emerald-500"
                                        : "bg-gray-100"
                                    } transition-colors mx-0.5`}
                                  />
                                )}
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    completed
                                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                                      : "bg-gray-100 text-gray-300"
                                  } transition-all duration-500`}
                                >
                                  {completed ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                  ) : (
                                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                  )}
                                </div>
                                {idx < STATUS_STEPS.length - 1 && (
                                  <div
                                    className={`flex-1 h-[3px] rounded-full ${
                                      isStepCompleted(
                                        order.status,
                                        STATUS_STEPS[idx + 1]
                                      )
                                        ? "bg-emerald-500"
                                        : "bg-gray-100"
                                    } transition-colors mx-0.5`}
                                  />
                                )}
                              </div>
                              <span className={`text-[10px] mt-2 font-bold ${completed ? 'text-gray-600' : 'text-gray-300'}`}>
                                {STATUS_STEP_LABELS[idx]}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() =>
                  setPagination((p) => ({ ...p, page: p.page - 1 }))
                }
                className="bg-white border-gray-200 text-gray-600 hover:bg-gray-50 rounded-full h-10 w-10 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-400 font-medium">
                {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() =>
                  setPagination((p) => ({ ...p, page: p.page + 1 }))
                }
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

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-emerald-50/80 via-white to-white">
        <div className="p-5 pt-20 space-y-4 max-w-lg mx-auto">
          <Skeleton className="h-10 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-3xl" />
          <Skeleton className="h-40 w-full rounded-3xl" />
        </div>
      </div>
    }>
      <OrdersPageContent />
    </Suspense>
  );
}
