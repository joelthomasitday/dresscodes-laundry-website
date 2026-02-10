"use client";

import { DashboardAuthProvider } from "@/contexts/dashboard-auth-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardAuthProvider>{children}</DashboardAuthProvider>;
}
