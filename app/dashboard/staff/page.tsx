"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboardAuth } from "@/contexts/dashboard-auth-context";
import { DashboardNav, MobilePageHeader } from "@/components/dashboard-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  UserPlus,
  Search,
  ShieldCheck,
  Truck,
  Mail,
  Phone,
  Loader2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StaffUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "staff" | "rider";
  isActive: boolean;
  createdAt: string;
}

export default function StaffManagementPage() {
  const {
    user: currentUser,
    isAuthenticated,
    isLoading: authLoading,
  } = useDashboardAuth();
  const router = useRouter();
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "rider",
  });

  useEffect(() => {
    if (
      !authLoading &&
      (!isAuthenticated || currentUser?.role !== "admin")
    ) {
      router.push("/dashboard/login");
    }
  }, [authLoading, isAuthenticated, currentUser, router]);

  useEffect(() => {
    if (isAuthenticated && currentUser?.role === "admin") {
      fetchUsers();
    }
  }, [isAuthenticated, currentUser]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error("Failed to load staff list");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`${formData.role} added successfully`);
        setIsDialogOpen(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          role: "rider",
        });
        fetchUsers();
      } else {
        toast.error(data.error || "Failed to add user");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this staff member? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Staff member removed successfully");
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to remove staff member");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading) return null;
  if (!isAuthenticated || currentUser?.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/80 via-white to-white">
      <MobilePageHeader title="Staff Management" backHref="/dashboard" />
      <DashboardNav />

      <main className="pt-16 pb-24 md:pt-0 md:ml-64 md:pb-8">
        <div className="p-5 pt-3 md:p-6 lg:p-8 space-y-6 max-w-lg mx-auto md:max-w-none">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-gray-800 tracking-tight">
                Staff Management
              </h1>
              <p className="text-sm text-gray-400">
                Manage riders and dashboard staff roles
              </p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full gap-2 font-semibold shadow-md shadow-emerald-500/20 active:scale-95 transition-all">
                  <UserPlus className="h-4 w-4" />
                  Add New Staff
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white border-gray-200 text-gray-800 max-w-md rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-gray-800">
                    Add New Staff Member
                  </DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={handleCreateUser}
                  className="space-y-4 pt-4"
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-gray-500 text-xs font-medium"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Jane Doe"
                      className="bg-gray-50 border-gray-200 text-gray-800 rounded-xl h-11 focus:border-emerald-400"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-gray-500 text-xs font-medium"
                      >
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="jane@example.com"
                        className="bg-gray-50 border-gray-200 text-gray-800 rounded-xl h-11 focus:border-emerald-400"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-gray-500 text-xs font-medium"
                      >
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        placeholder="9876543210"
                        className="bg-gray-50 border-gray-200 text-gray-800 rounded-xl h-11 focus:border-emerald-400"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="role"
                      className="text-gray-500 text-xs font-medium"
                    >
                      Role
                    </Label>
                    <Select
                      value={formData.role}
                      onValueChange={(v) =>
                        setFormData({ ...formData, role: v })
                      }
                    >
                      <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-800 rounded-xl h-11">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 text-gray-800 rounded-xl">
                        <SelectItem value="rider">Rider</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-gray-500 text-xs font-medium"
                    >
                      Login Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="bg-gray-50 border-gray-200 text-gray-800 rounded-xl h-11 focus:border-emerald-400"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-12 mt-2 shadow-md shadow-emerald-500/20"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Create User"
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              className="bg-white border-gray-200 pl-11 text-gray-800 h-12 rounded-2xl focus:ring-emerald-500/20 focus:border-emerald-400 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* User List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {loading ? (
              Array(6)
                .fill(0)
                .map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-48 bg-gray-100/50 rounded-2xl"
                  />
                ))
            ) : filteredUsers.length === 0 ? (
              <div className="col-span-full py-20 text-center space-y-3">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">
                  No staff members found
                </p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden p-5"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                          user.role === "rider"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-purple-50 text-purple-600"
                        }`}
                      >
                        {user.role === "rider" ? (
                          <Truck className="h-6 w-6" />
                        ) : (
                          <ShieldCheck className="h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-base">
                          {user.name}
                        </h3>
                        <Badge
                          className={`mt-0.5 capitalize text-[10px] rounded-full ${
                            user.role === "rider"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                          } border-0`}
                        >
                          {user.role}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 text-sm text-gray-500">
                      <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center">
                        <Mail className="h-3.5 w-3.5 text-gray-400" />
                      </div>
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-gray-500">
                      <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center">
                        <Phone className="h-3.5 w-3.5 text-gray-400" />
                      </div>
                      <span>{user.phone}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                      Joined{" "}
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUser(user._id)}
                      disabled={deletingId === user._id}
                      className="text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 h-8 rounded-xl transition-colors"
                    >
                      {deletingId === user._id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                      )}
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
