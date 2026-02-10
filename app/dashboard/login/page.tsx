"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboardAuth } from "@/contexts/dashboard-auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function DashboardLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, isAuthenticated } = useDashboardAuth();
  const router = useRouter();

  // If already authenticated, redirect
  if (isAuthenticated) {
    router.push("/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(email, password);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Invalid email or password");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/80 via-white to-white flex items-center justify-center p-5">
      <div className="w-full max-w-sm">
        {/* Logo + Title */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-5">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">dresscode</h1>
          <p className="text-gray-400 text-sm mt-1">Management Dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-500 text-sm px-4 py-3 rounded-2xl text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-gray-500 text-xs font-medium"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border-gray-200 text-gray-800 h-12 rounded-xl focus:border-emerald-400 focus:ring-emerald-500/20 placeholder:text-gray-400"
                placeholder="admin@dresscodes.in"
                required
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-gray-500 text-xs font-medium"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-50 border-gray-200 text-gray-800 h-12 rounded-xl focus:border-emerald-400 focus:ring-emerald-500/20 pr-12 placeholder:text-gray-400"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-2xl transition-all duration-200 shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <p className="text-gray-400 text-xs text-center mt-6">
            Protected area — authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
}
