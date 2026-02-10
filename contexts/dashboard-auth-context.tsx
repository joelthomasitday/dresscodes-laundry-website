"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { UserRole } from "@/lib/constants";

interface DashboardUser {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
}

interface DashboardAuthContextType {
  user: DashboardUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const DashboardAuthContext = createContext<DashboardAuthContextType | undefined>(
  undefined
);

export const useDashboardAuth = () => {
  const ctx = useContext(DashboardAuthContext);
  if (!ctx)
    throw new Error(
      "useDashboardAuth must be used within DashboardAuthProvider"
    );
  return ctx;
};

export function DashboardAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth status on mount
  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser({
          userId: data.user.id,
          email: data.user.email,
          role: data.user.role,
          name: data.user.name,
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    setUser(null);
  };

  return (
    <DashboardAuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </DashboardAuthContext.Provider>
  );
}
