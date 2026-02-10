"use client";

import { useDashboardAuth } from "@/contexts/dashboard-auth-context";
import { DashboardNav, MobilePageHeader } from "@/components/dashboard-nav";
import {
  CreditCard,
  User,
  Bell,
  Lock,
  Crown,
  Settings,
  LogOut,
  ChevronRight,
  Headphones,
  Shield,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const SETTINGS_ITEMS = [
  {
    label: "Payment Methods",
    icon: CreditCard,
    href: "#",
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Personal Information",
    icon: User,
    href: "#",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Notifications",
    icon: Bell,
    href: "#",
    color: "bg-orange-50 text-orange-600",
  },
  {
    label: "Password",
    icon: Lock,
    href: "#",
    color: "bg-purple-50 text-purple-600",
  },
  {
    label: "Privacy",
    icon: Shield,
    href: "#",
    color: "bg-pink-50 text-pink-600",
  },
  {
    label: "Support",
    icon: Headphones,
    href: "#",
    color: "bg-cyan-50 text-cyan-600",
  },
];

export default function ProfilePage() {
  const { user, logout, isLoading } = useDashboardAuth();

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/80 via-white to-white">
      {/* Custom header */}
      <MobilePageHeader
        title="Profile"
        backHref="/dashboard"
        rightSlot={
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={logout}
              className="p-2 rounded-full hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        }
      />
      <DashboardNav />

      <main className="pt-16 pb-24 md:pt-0 md:ml-64 md:pb-8">
        <div className="p-5 md:p-6 lg:p-8 space-y-6 max-w-lg mx-auto md:max-w-none">
          {/* Avatar + Name */}
          <div className="flex flex-col items-center pt-4 mb-2">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-300 via-pink-300 to-purple-400 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-pink-200/50">
                {user.name.charAt(0).toUpperCase()}
              </div>
              {/* Camera icon overlay */}
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-800">{user.name}</h1>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>


          {/* Account Settings */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-800">
                Account settings
              </h2>
              <button className="text-xs text-emerald-600 font-medium hover:text-emerald-700 transition-colors">
                Edit
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {SETTINGS_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2.5 border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-[0.97]"
                >
                  <div
                    className={`w-11 h-11 ${item.color} rounded-2xl flex items-center justify-center`}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-gray-600 text-center">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Sign Out button (desktop & extra) */}
          <button
            onClick={logout}
            className="w-full py-3.5 text-sm font-semibold text-red-500 bg-red-50 rounded-2xl hover:bg-red-100 transition-colors active:scale-[0.98]"
          >
            Sign Out
          </button>
        </div>
      </main>
    </div>
  );
}
