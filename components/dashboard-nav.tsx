"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDashboardAuth } from "@/contexts/dashboard-auth-context";
import { cn } from "@/lib/utils";
import {
  Home,
  ClipboardList,
  Plus,
  Tag,
  User,
  Bell,
  ChevronLeft,
  Settings,
  LogOut,
  FileText,
  Truck,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

interface BottomNavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  isCenter?: boolean;
}

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: string;
}

export function DashboardNav({ showLogoHeader = false }: { showLogoHeader?: boolean }) {
  const { user, logout } = useDashboardAuth();
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Poll for new notifications every minute
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const markAsRead = async () => {
    try {
      await fetch("/api/notifications", { method: "PATCH" });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!user) return null;

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  // Define nav items based on user role
  let navItems: BottomNavItem[] = [];
  
  if (user.role === "admin") {
    navItems = [
      { href: "/dashboard", label: "Home", icon: Home },
      { href: "/dashboard/invoices", label: "Invoices", icon: FileText },
      { href: "/dashboard/orders", label: "Orders", icon: ClipboardList, isCenter: true },
      { href: "/dashboard/rider-tasks", label: "Tasks", icon: Truck },
      { href: "/dashboard/staff", label: "Staff", icon: Users },
    ];
  } else if (user.role === "rider") {
    navItems = [
      { href: "/dashboard", label: "Home", icon: Home },
      { href: "/dashboard/rider-tasks", label: "Tasks", icon: Truck, isCenter: true },
      { href: "/dashboard/profile", label: "Profile", icon: User },
    ];
  } else {
    // Default for staff
    navItems = [
      { href: "/dashboard", label: "Home", icon: Home },
      { href: "/dashboard/invoices", label: "Invoices", icon: FileText },
      { href: "/dashboard/orders", label: "Orders", icon: ClipboardList, isCenter: true },
      { href: "/dashboard/rider-tasks", label: "Tasks", icon: Truck },
      { href: "/dashboard/profile", label: "Profile", icon: User },
    ];
  }

  return (
    <>
      {showLogoHeader && (
        <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/40">
        <div className="flex items-center justify-between px-5 h-16">
          <div className="flex flex-col">
            <span className="text-emerald-700 font-bold text-lg leading-none">
              dresscode
            </span>
            <span className="text-[10px] text-gray-400 font-medium mt-0.5">
              {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening'}, {user.name.split(' ')[0]}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifs(!showNotifs);
                  if (!showNotifs && unreadCount > 0) markAsRead();
                }}
                className="relative p-2.5 rounded-2xl bg-gray-50 text-gray-500 hover:bg-gray-100 transition-all border border-gray-100/50"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifs && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl shadow-emerald-900/10 border border-gray-100 py-3 z-[100] animate-in fade-in zoom-in duration-200 origin-top-right">
                  <div className="px-5 py-2 border-b border-gray-50 flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-800">Notifications</span>
                    {unreadCount > 0 && <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold">{unreadCount} New</span>}
                  </div>
                  <div className="max-h-[350px] overflow-y-auto px-2 mt-2">
                    {notifications.length === 0 ? (
                      <div className="py-12 text-center">
                        <Bell className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                        <p className="text-xs text-gray-400">All caught up!</p>
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div key={n._id} className={cn(
                          "p-3 rounded-2xl transition-colors mb-1",
                          n.isRead ? "hover:bg-gray-50" : "bg-emerald-50/40 hover:bg-emerald-50/60"
                        )}>
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0",
                              n.type === 'NEW_ORDER' ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                            )}>
                              {n.type === 'NEW_ORDER' ? <ClipboardList className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-gray-800 leading-tight">{n.title}</p>
                              <p className="text-[11px] text-gray-500 mt-0.5 leading-snug line-clamp-2">{n.message}</p>
                              <p className="text-[9px] text-gray-400 mt-1 font-medium">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <Link 
              href="/dashboard/profile"
              className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center font-bold text-sm border border-emerald-100 shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              {user.name.charAt(0).toUpperCase()}
            </Link>
          </div>
        </div>
      </header>
      )}

      {/* ---- MOBILE BOTTOM NAV ---- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-white/90 backdrop-blur-xl border-t border-gray-100 px-2 pb-[env(safe-area-inset-bottom)]">
          <div className="flex items-center justify-around h-16">
            {navItems.map((item) => {
              if (item.isCenter) {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-center -mt-6"
                  >
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all active:scale-95">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                  </Link>
                );
              }

              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-0.5 px-3 py-1"
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      active ? "text-emerald-600" : "text-gray-400"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] font-medium transition-colors",
                      active ? "text-emerald-600" : "text-gray-400"
                    )}
                  >
                    {item.label}
                  </span>
                  {active && (
                    <div className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ---- DESKTOP SIDEBAR (kept for larger screens) ---- */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 z-40 shadow-sm">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-100">
          <Link
            href="/dashboard"
            className="text-emerald-600 font-bold text-xl tracking-tight"
          >
            dresscode
          </Link>
          <p className="text-xs text-gray-400 mt-1">Management Dashboard</p>
        </div>

        {/* Desktop navigation links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {[
            { href: "/dashboard", label: "Home", icon: Home },
            { href: "/dashboard/orders", label: "Orders", icon: ClipboardList },
            { href: "/dashboard/services", label: "Services", icon: Tag },
            { href: "/dashboard/invoices", label: "Invoices", icon: FileText },
            { href: "/dashboard/staff", label: "Staff", icon: Users },
            { href: "/dashboard/rider-tasks", label: "Rider Tasks", icon: Truck },
          ]
            .filter((item) => {
              if (user.role === "admin") return true;
              if (user.role === "staff")
                return ["/dashboard", "/dashboard/orders"].includes(item.href);
              if (user.role === "rider")
                return ["/dashboard", "/dashboard/rider-tasks"].includes(
                  item.href
                );
              return false;
            })
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all",
                  isActive(item.href)
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {item.label}
              </Link>
            ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-100 space-y-3">
          <div className="flex items-center gap-3 px-3">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800 font-medium truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-400 capitalize">{user.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium text-red-500 hover:bg-red-50 w-full transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

/**
 * Reusable mobile page header with back button
 */
export function MobilePageHeader({
  title,
  backHref,
  rightSlot,
}: {
  title: string;
  backHref?: string;
  rightSlot?: React.ReactNode;
}) {
  const { user } = useDashboardAuth();
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/40">
      <div className="flex items-center justify-between px-5 h-16">
        <div className="flex items-center gap-2">
          {backHref && (
            <Link
              href={backHref}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </Link>
          )}
          <span className="text-base font-semibold text-gray-800">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {rightSlot || (
            <>
              <button className="p-2.5 rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100 transition-all border border-gray-100/50">
                <Bell className="h-5 w-5" />
              </button>
              {user && (
                <Link 
                  href="/dashboard/profile"
                  className="w-9 h-9 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center font-bold text-sm border border-emerald-100"
                >
                  {user.name.charAt(0).toUpperCase()}
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
