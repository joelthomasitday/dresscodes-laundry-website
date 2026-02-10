"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboardAuth } from "@/contexts/dashboard-auth-context";
import { DashboardNav } from "@/components/dashboard-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingBag,
  IndianRupee,
  CalendarCheck,
  Clock,
  ArrowRight,
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
  }[];
}

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
      <div className="min-h-screen bg-gray-950">
        <div className="md:ml-64 p-4 md:p-6 lg:p-8 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 bg-gray-900" />
            <Skeleton className="h-4 w-64 bg-gray-900" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 bg-gray-900 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-64 w-full bg-gray-900 rounded-xl" />
          <Skeleton className="h-96 w-full bg-gray-900 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const statCards = [
    {
      label: "Total Orders",
      value: data?.stats.totalOrders ?? 0,
      icon: ShoppingBag,
      color: "from-blue-500 to-blue-600",
      shadow: "shadow-blue-500/20",
    },
    {
      label: "Revenue",
      value: `₹${(data?.stats.totalRevenue ?? 0).toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "from-emerald-500 to-emerald-600",
      shadow: "shadow-emerald-500/20",
    },
    {
      label: "Today's Orders",
      value: data?.stats.todayOrders ?? 0,
      icon: CalendarCheck,
      color: "from-purple-500 to-purple-600",
      shadow: "shadow-purple-500/20",
    },
    {
      label: "Pending",
      value: data?.stats.pendingOrders ?? 0,
      icon: Clock,
      color: "from-orange-500 to-orange-600",
      shadow: "shadow-orange-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      <DashboardNav />

      {/* Main content */}
      <main className="pt-14 md:pt-0 md:ml-64">
        <div className="p-4 md:p-6 lg:p-8 space-y-6">
          {/* Page header */}
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">
              Welcome back, {user?.name} 👋
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Here's what's happening with your laundry business
            </p>
          </div>

          {/* Stat Cards — 2x2 grid on mobile, 4-col on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {statCards.map((stat) => (
              <Card
                key={stat.label}
                className={`bg-gray-900 border-gray-800 overflow-hidden`}
              >
                <CardContent className="p-4 md:p-5">
                  {loading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-16 bg-gray-800" />
                      <Skeleton className="h-7 w-20 bg-gray-800" />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs md:text-sm text-gray-400">
                          {stat.label}
                        </span>
                        <div
                          className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg ${stat.shadow}`}
                        >
                          <stat.icon className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <p className="text-xl md:text-2xl font-bold text-white">
                        {stat.value}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Status breakdown */}
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 md:p-6">
              <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">
                Order Status Breakdown
              </h2>
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-16 bg-gray-800 rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {data &&
                    Object.entries(data.statusCounts).map(([status, count]) => (
                      <Link
                        key={status}
                        href={`/dashboard/orders?status=${status}`}
                        className="bg-gray-800/50 rounded-xl p-3 hover:bg-gray-800 transition-colors group"
                      >
                        <Badge
                          className={`${
                            ORDER_STATUS_COLORS[status as OrderStatus]
                          } text-[10px] mb-2`}
                        >
                          {ORDER_STATUS_LABELS[status as OrderStatus]}
                        </Badge>
                        <p className="text-2xl font-bold text-white">{count}</p>
                      </Link>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                  Recent Orders
                </h2>
                <Link
                  href="/dashboard/orders"
                  className="text-emerald-400 text-sm flex items-center gap-1 hover:text-emerald-300 transition-colors"
                >
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 bg-gray-800 rounded-xl" />
                  ))}
                </div>
              ) : data?.recentOrders.length === 0 ? (
                <div className="text-center py-12 bg-gray-800/20 rounded-2xl border border-dashed border-gray-800">
                  <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="h-8 w-8 text-gray-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-300">No recent orders</h3>
                  <p className="text-xs text-gray-500 max-w-[200px] mx-auto mt-1">
                    When customers place orders, they'll appear here for quick access.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data?.recentOrders.map((order) => (
                    <Link
                      key={order._id}
                      href={`/dashboard/orders/${order._id}`}
                      className="flex items-center justify-between p-4 bg-gray-800/40 rounded-xl hover:bg-gray-800/70 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-white">
                            {order.orderNumber}
                          </span>
                          <Badge
                            className={`${
                              ORDER_STATUS_COLORS[order.status]
                            } text-[10px]`}
                          >
                            {ORDER_STATUS_LABELS[order.status]}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 truncate">
                          {order.customer.name}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-semibold text-white">
                          ₹{order.totalAmount}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-600 ml-2 group-hover:text-emerald-400 transition-colors" />
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
