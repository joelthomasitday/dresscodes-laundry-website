"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDashboardAuth } from "@/contexts/dashboard-auth-context";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  Truck,
  Users,
  LogOut,
  Menu,
  X,
  Settings,
  Package,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  roles: string[];
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, roles: ["admin"] },
  { href: "/dashboard/orders", label: "Orders", icon: ClipboardList, roles: ["admin", "staff"] },
  { href: "/dashboard/invoices", label: "Invoices", icon: FileText, roles: ["admin"] },
  { href: "/dashboard/rider-tasks", label: "Rider Tasks", icon: Truck, roles: ["admin", "rider"] },
  { href: "/dashboard/services", label: "Services", icon: Package, roles: ["admin"] },
  { href: "/dashboard/staff", label: "Staff", icon: Users, roles: ["admin"] },
];

export function DashboardNav() {
  const { user, logout } = useDashboardAuth();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (!user) return null;

  const visibleItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(user.role)
  );

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ---- MOBILE TOP BAR ---- */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/dashboard" className="text-emerald-400 font-bold text-lg">
            dresscode
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full capitalize">
              {user.role}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="text-gray-300 hover:text-white hover:bg-gray-800"
            >
              {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* ---- MOBILE DROPDOWN NAV ---- */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 pt-14">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <nav className="relative bg-gray-900 border-b border-gray-800 shadow-2xl">
            <div className="p-3 space-y-1">
              {visibleItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    isActive(item.href)
                      ? "bg-emerald-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white active:bg-gray-700"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setIsMobileOpen(false);
                  logout();
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 active:bg-red-500/20 w-full transition-all"
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* ---- DESKTOP SIDEBAR ---- */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 bg-gray-900 border-r border-gray-800 z-40">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-800">
          <Link href="/dashboard" className="text-emerald-400 font-bold text-xl">
            dresscode
          </Link>
          <p className="text-xs text-gray-500 mt-1">Management Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {visibleItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                isActive(item.href)
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-800 space-y-3">
          <div className="flex items-center gap-3 px-3">
            <div className="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 w-full transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
