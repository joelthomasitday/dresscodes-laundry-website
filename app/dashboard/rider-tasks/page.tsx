"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboardAuth } from "@/contexts/dashboard-auth-context";
import { DashboardNav, MobilePageHeader } from "@/components/dashboard-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Truck,
  Package,
  Phone,
  MapPin,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import type { TaskType, TaskStatus } from "@/lib/constants";

interface RiderTaskItem {
  _id: string;
  orderNumber: string;
  type: TaskType;
  status: TaskStatus;
  customer: { name: string; phone: string; address: string };
  scheduledTime?: string;
  completedTime?: string;
  proofImageUrl?: string;
  createdAt: string;
}

const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  assigned: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-800",
};

const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  assigned: "Assigned",
  in_progress: "In Progress",
  completed: "Completed",
};

export default function RiderTasksPage() {
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
  } = useDashboardAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<RiderTaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/dashboard/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) fetchTasks();
  }, [isAuthenticated, filter]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.set("status", filter);
      const res = await fetch(`/api/rider-tasks?${params}`);
      if (res.ok) {
        const json = await res.json();
        setTasks(json.tasks);
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    taskId: string,
    newStatus: TaskStatus
  ) => {
    setUpdatingId(taskId);
    try {
      const res = await fetch(`/api/rider-tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        await fetchTasks();
      }
    } catch (err) {
      console.error("Failed to update task:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50/80 via-white to-white">
        <div className="p-5 pt-20 space-y-4 max-w-lg mx-auto">
          <Skeleton className="h-6 w-40 bg-gray-100 rounded-xl" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton
                key={i}
                className="h-9 w-24 flex-shrink-0 bg-gray-100 rounded-full"
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

  const activeTasks = tasks.filter((t) => t.status !== "completed");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/80 via-white to-white">
      <MobilePageHeader
        title={user?.role === "rider" ? "My Tasks" : "Rider Tasks"}
        backHref="/dashboard"
      />
      <DashboardNav />

      <main className="pt-16 pb-24 md:pt-0 md:ml-64 md:pb-8">
        <div className="p-5 pt-3 md:p-6 lg:p-8 space-y-4 max-w-lg mx-auto md:max-w-none">
          {/* Desktop header */}
          <div className="hidden md:block">
            <h1 className="text-xl font-bold text-gray-800">
              {user?.role === "rider" ? "My Tasks" : "Rider Tasks"}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {activeTasks.length} active • {completedTasks.length} completed
            </p>
          </div>

          {/* Filter pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 md:mx-0 md:px-0 scrollbar-hide">
            {["all", "assigned", "in_progress", "completed"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-semibold transition-all capitalize ${
                  filter === s
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                    : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {s === "all"
                  ? "All"
                  : TASK_STATUS_LABELS[s as TaskStatus]}
              </button>
            ))}
          </div>

          {/* Task Cards */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  className="h-40 bg-gray-100/50 rounded-2xl"
                />
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No tasks found</p>
              <p className="text-gray-400 text-xs mt-1">
                {user?.role === "rider"
                  ? "You'll see tasks once assigned"
                  : "Assign riders to orders to create tasks"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <div className="p-4 space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            task.type === "pickup"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-orange-50 text-orange-600"
                          }`}
                        >
                          {task.type === "pickup" ? (
                            <Package className="h-4 w-4" />
                          ) : (
                            <Truck className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-gray-800 capitalize">
                            {task.type}
                          </span>
                          <p className="text-xs text-gray-400">
                            {task.orderNumber}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={`${
                          TASK_STATUS_COLORS[task.status]
                        } text-[10px] rounded-full px-2.5`}
                      >
                        {TASK_STATUS_LABELS[task.status]}
                      </Badge>
                    </div>

                    {/* Customer info */}
                    <div className="bg-gray-50/80 rounded-xl p-3 space-y-2">
                      <p className="text-sm font-medium text-gray-800">
                        {task.customer.name}
                      </p>
                      <div className="flex items-start gap-2 text-xs text-gray-400">
                        <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                        <span>{task.customer.address}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <a
                        href={`tel:${task.customer.phone}`}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 rounded-2xl text-sm text-emerald-600 font-semibold hover:bg-emerald-50 active:scale-[0.98] transition-all"
                      >
                        <Phone className="h-4 w-4" />
                        Call Customer
                      </a>

                      {task.status === "assigned" && (
                        <Button
                          onClick={() =>
                            handleStatusUpdate(task._id, "in_progress")
                          }
                          disabled={updatingId === task._id}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-auto py-3 text-sm font-semibold shadow-md shadow-emerald-500/20 active:scale-[0.98]"
                        >
                          {updatingId === task._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>Start Pickup</>
                          )}
                        </Button>
                      )}

                      {task.status === "in_progress" && (
                        <Button
                          onClick={() =>
                            handleStatusUpdate(task._id, "completed")
                          }
                          disabled={updatingId === task._id}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-auto py-3 text-sm font-semibold shadow-md shadow-blue-500/20 active:scale-[0.98]"
                        >
                          {updatingId === task._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-1.5" />
                              Complete
                            </>
                          )}
                        </Button>
                      )}

                      {task.status === "completed" && (
                        <div className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-50 rounded-2xl text-sm text-emerald-600 font-semibold border border-emerald-100">
                          <CheckCircle2 className="h-4 w-4" />
                          Completed
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
