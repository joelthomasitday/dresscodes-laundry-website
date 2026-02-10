"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDashboardAuth } from "@/contexts/dashboard-auth-context";
import { DashboardNav } from "@/components/dashboard-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  ArrowRight,
  Plus,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Phone,
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
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function OrdersPage() {
  const { isAuthenticated, isLoading: authLoading } = useDashboardAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1, limit: 20, total: 0, totalPages: 0,
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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <div className="md:ml-64 p-4 md:p-6 lg:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48 bg-gray-900" />
              <Skeleton className="h-4 w-32 bg-gray-900" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full bg-gray-900 rounded-xl" />
            <div className="flex gap-2 overflow-hidden">
               {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-8 w-20 flex-shrink-0 bg-gray-900 rounded-full" />)}
            </div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 bg-gray-900 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-950">
      <DashboardNav />

      <main className="pt-14 md:pt-0 md:ml-64">
        <div className="p-4 md:p-6 lg:p-8 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">Orders</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {pagination.total} total orders
              </p>
            </div>
          </div>

          {/* Filters — horizontal scroll on mobile */}
          <div className="space-y-3">
            {/* Search bar */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, phone, or order #"
                className="pl-10 bg-gray-900 border-gray-800 text-white h-11 rounded-xl placeholder:text-gray-600"
              />
            </form>

            {/* Status filter — scrollable pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
              <button
                onClick={() => {
                  setStatusFilter("all");
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  statusFilter === "all"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                All
              </button>
              {ORDER_STATUSES.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setPagination((p) => ({ ...p, page: 1 }));
                  }}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                    statusFilter === status
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {ORDER_STATUS_LABELS[status]}
                </button>
              ))}
            </div>
          </div>

          {/* Order List — Card-based for mobile */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-28 bg-gray-900 rounded-xl" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <ClipboardList className="h-16 w-16 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-400 font-medium">No orders found</p>
              <p className="text-gray-600 text-sm mt-1">
                {statusFilter !== "all"
                  ? "Try changing the status filter"
                  : "Orders placed by customers will appear here"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <Link
                  key={order._id}
                  href={`/dashboard/orders/${order._id}`}
                >
                  <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800/70 transition-all cursor-pointer active:scale-[0.99]">
                    <CardContent className="p-4">
                      {/* Row 1: Order # and Status */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-white">
                          {order.orderNumber}
                        </span>
                        <Badge
                          className={`${ORDER_STATUS_COLORS[order.status]} text-[10px]`}
                        >
                          {ORDER_STATUS_LABELS[order.status]}
                        </Badge>
                      </div>

                      {/* Row 2: Customer name and amount */}
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-300 font-medium truncate pr-4">
                          {order.customer.name}
                        </p>
                        <span className="text-sm font-semibold text-emerald-400 flex-shrink-0">
                          ₹{order.totalAmount}
                        </span>
                      </div>

                      {/* Row 3: Services & Date */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="truncate pr-4">
                          {order.services
                            .map((s) => `${s.name}${s.quantity > 1 ? ` ×${s.quantity}` : ""}`)
                            .join(", ")}
                        </span>
                        <span className="flex-shrink-0">
                          {new Date(order.pickupDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </span>
                      </div>

                      {/* Row 4: Phone (tap to call) */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
                        <a
                          href={`tel:${order.customer.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300"
                        >
                          <Phone className="h-3 w-3" />
                          {order.customer.phone}
                        </a>
                        <ArrowRight className="h-4 w-4 text-gray-600" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
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
                className="bg-gray-900 border-gray-800 text-gray-300 hover:bg-gray-800 rounded-xl"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-400">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() =>
                  setPagination((p) => ({ ...p, page: p.page + 1 }))
                }
                className="bg-gray-900 border-gray-800 text-gray-300 hover:bg-gray-800 rounded-xl"
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
