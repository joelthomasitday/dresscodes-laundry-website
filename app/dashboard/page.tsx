"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboardAuth } from "@/contexts/dashboard-auth-context";
import { DashboardNav } from "@/components/dashboard-nav";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingBag,
  Shirt,
  Sparkles,
  ArrowRight,
  CalendarPlus,
  Truck,
  Crown,
  Droplets,
  Wind,
  Star,
  Scissors,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  type OrderStatus,
} from "@/lib/constants";

interface DashboardData {
  stats: {
    totalOrders: number;
    totalRevenue: number;
    todayOrders: number;
    pendingOrders: number;
  };
  statusCounts: Record<string, number>;
  recentOrders: {
    _id: string;
    orderNumber: string;
    customer: { name: string };
    status: OrderStatus;
    totalAmount: number;
    createdAt: string;
    services?: { name: string }[];
  }[];
}

const SERVICE_ICONS = [
  { label: "Wash & Fold", icon: Shirt, color: "bg-emerald-50 text-emerald-600" },
  { label: "Dry Clean", icon: Sparkles, color: "bg-blue-50 text-blue-600" },
  { label: "Iron Only", icon: Wind, color: "bg-orange-50 text-orange-600" },
  { label: "Stain Removal", icon: Droplets, color: "bg-pink-50 text-pink-600" },
  { label: "Special Items", icon: Star, color: "bg-purple-50 text-purple-600" },
  { label: "More", icon: MoreHorizontal, color: "bg-gray-50 text-gray-500" },
];

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useDashboardAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/dashboard/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboard();
    }
  }, [isAuthenticated]);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/dashboard");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50/80 via-white to-white">
        <div className="p-5 pt-20 space-y-6 max-w-lg mx-auto">
          <Skeleton className="h-6 w-40 bg-emerald-100/50 rounded-xl" />
          <Skeleton className="h-36 w-full bg-emerald-100/30 rounded-3xl" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-20 bg-gray-100 rounded-2xl" />
            <Skeleton className="h-20 bg-gray-100 rounded-2xl" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 bg-gray-100 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/80 via-green-50/30 to-white">
      <DashboardNav showLogoHeader />

      {/* Main content */}
      <main className="pt-16 pb-24 md:pt-0 md:ml-64 md:pb-8">
        <div className="p-5 md:p-6 lg:p-8 space-y-6 max-w-lg mx-auto md:max-w-none">

          {/* ── Stats Summary ── */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center">
                  <Shirt className="h-5 w-5 text-emerald-600" />
                </div>
                <span className="text-xs font-medium text-gray-500">Total Orders</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {data?.stats.totalOrders ?? 0}
              </p>
            </div>
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center">
                  <Truck className="h-5 w-5 text-orange-600" />
                </div>
                <span className="text-xs font-medium text-gray-500">Pending</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {data?.stats.pendingOrders ?? 0}
              </p>
            </div>
          </div>

          {/* ── Quick Actions ── */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/booking"
              className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-[0.98] group"
            >
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                <CalendarPlus className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Schedule pickup</p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
            </Link>

            <Link
              href="/booking"
              className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-[0.98] group"
            >
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                <Truck className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Schedule delivery</p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
            </Link>
          </div>

          {/* ── Our Services ── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-800">
                Our services
              </h2>
              <Link
                href="/dashboard/services"
                className="text-xs text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {SERVICE_ICONS.map((item) => (
                <Link
                  key={item.label}
                  href="/dashboard/services"
                  className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2.5 border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-[0.97]"
                >
                  <div
                    className={`w-11 h-11 ${item.color} rounded-2xl flex items-center justify-center`}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-medium text-gray-600 text-center leading-tight">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* ── Status Breakdown (Admin) ── */}
          {data && Object.keys(data.statusCounts).length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-800 mb-3">
                Order status
              </h2>
              <div className="grid grid-cols-2 gap-2.5">
                {Object.entries(data.statusCounts).map(([status, count]) => (
                  <Link
                    key={status}
                    href={`/dashboard/orders?status=${status}`}
                    className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-[0.98] group"
                  >
                    <Badge
                      className={`${
                        ORDER_STATUS_COLORS[status as OrderStatus]
                      } text-[10px] mb-2 rounded-full`}
                    >
                      {ORDER_STATUS_LABELS[status as OrderStatus]}
                    </Badge>
                    <p className="text-2xl font-bold text-gray-800">{count}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── Recent Orders ── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-800">
                Recent orders
              </h2>
              <Link
                href="/dashboard/orders"
                className="text-xs text-emerald-600 font-medium flex items-center gap-1 hover:text-emerald-700 transition-colors"
              >
                View All
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton
                    key={i}
                    className="h-20 bg-gray-100/50 rounded-2xl"
                  />
                ))}
              </div>
            ) : data?.recentOrders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-8 w-8 text-gray-300" />
                </div>
                <h3 className="text-sm font-semibold text-gray-600">
                  No recent orders
                </h3>
                <p className="text-xs text-gray-400 max-w-[200px] mx-auto mt-1">
                  When customers place orders, they'll appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {data?.recentOrders.map((order) => (
                  <Link
                    key={order._id}
                    href={`/dashboard/orders/${order._id}`}
                    className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-[0.99] group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Shirt className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-semibold text-gray-800">
                            {order.orderNumber}
                          </span>
                          <Badge
                            className={`${
                              ORDER_STATUS_COLORS[order.status]
                            } text-[9px] rounded-full px-2`}
                          >
                            {ORDER_STATUS_LABELS[order.status]}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400 truncate">
                          {order.customer.name} •{" "}
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            { day: "2-digit", month: "short" }
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-3 flex-shrink-0">
                      <p className="text-sm font-semibold text-gray-800">
                        ₹{order.totalAmount}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
