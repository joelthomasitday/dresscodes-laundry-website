"use client";

import { useEffect, useState } from "react";
import { useDashboardAuth } from "@/contexts/dashboard-auth-context";
import { DashboardNav, MobilePageHeader } from "@/components/dashboard-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Trash2,
  Edit2,
  Loader2,
  Save,
  X,
  Package,
  Shirt,
  Sparkles,
  Wind,
  Droplets,
} from "lucide-react";
import { Label } from "@/components/ui/label";

interface ServiceItem {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  isActive: boolean;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Laundry: Shirt,
  "Dry Cleaning": Sparkles,
  Ironing: Wind,
  "Premium Care": Droplets,
};

export default function ServicesPage() {
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
  } = useDashboardAuth();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Laundry",
    price: 0,
    unit: "piece",
  });

  useEffect(() => {
    if (isAuthenticated) fetchServices();
  }, [isAuthenticated]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services");
      if (res.ok) {
        const data = await res.json();
        setServices(data.services);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editingId ? `/api/services/${editingId}` : "/api/services";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchServices();
        setIsAdding(false);
        setEditingId(null);
        setFormData({
          name: "",
          description: "",
          category: "Laundry",
          price: 0,
          unit: "piece",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (service: ServiceItem) => {
    setEditingId(service._id);
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category,
      price: service.price,
      unit: service.unit,
    });
    setIsAdding(true);
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/80 via-white to-white">
      <MobilePageHeader title="Services" backHref="/dashboard" />
      <DashboardNav />

      <main className="pt-16 pb-24 md:pt-0 md:ml-64 md:pb-8">
        <div className="p-5 md:p-6 lg:p-8 space-y-6 max-w-lg mx-auto md:max-w-none">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-gray-800">Services</h1>
              <p className="text-sm text-gray-400">
                Manage your laundry service catalog
              </p>
            </div>
            {!isAdding && (
              <Button
                onClick={() => setIsAdding(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Service
              </Button>
            )}
          </div>

          {/* Add/Edit form */}
          {isAdding && (
            <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm">
              <div className="p-5">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-base font-bold text-gray-800">
                      {editingId ? "Edit Service" : "New Service"}
                    </h2>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAdding(false);
                        setEditingId(null);
                      }}
                      className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <X className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-500 text-xs font-medium">
                        Service Name
                      </Label>
                      <Input
                        required
                        className="bg-gray-50 border-gray-200 text-gray-800 rounded-xl h-11 focus:border-emerald-400 focus:ring-emerald-500/20"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-500 text-xs font-medium">
                        Category
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={(v) =>
                          setFormData({ ...formData, category: v })
                        }
                      >
                        <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-800 rounded-xl h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 text-gray-800 rounded-xl">
                          <SelectItem value="Laundry">Laundry</SelectItem>
                          <SelectItem value="Dry Cleaning">
                            Dry Cleaning
                          </SelectItem>
                          <SelectItem value="Premium Care">
                            Premium Care
                          </SelectItem>
                          <SelectItem value="Ironing">Ironing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-500 text-xs font-medium">
                        Price (₹)
                      </Label>
                      <Input
                        type="number"
                        required
                        className="bg-gray-50 border-gray-200 text-gray-800 rounded-xl h-11 focus:border-emerald-400 focus:ring-emerald-500/20"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-500 text-xs font-medium">
                        Unit
                      </Label>
                      <Input
                        required
                        className="bg-gray-50 border-gray-200 text-gray-800 rounded-xl h-11 focus:border-emerald-400 focus:ring-emerald-500/20"
                        value={formData.unit}
                        onChange={(e) =>
                          setFormData({ ...formData, unit: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-gray-500 text-xs font-medium">
                        Description
                      </Label>
                      <Input
                        className="bg-gray-50 border-gray-200 text-gray-800 rounded-xl h-11 focus:border-emerald-400 focus:ring-emerald-500/20"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-12 shadow-md shadow-emerald-500/20 active:scale-[0.98] transition-all"
                    >
                      {submitting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Save className="h-5 w-5 mr-2" />
                      )}
                      {editingId ? "Update" : "Save"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Service list */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  className="h-40 bg-gray-100/50 rounded-2xl"
                />
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">
                No services in your catalog
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Add your first service to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {services.map((service) => {
                const Icon =
                  CATEGORY_ICONS[service.category] || Package;
                return (
                  <div
                    key={service._id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-11 h-11 bg-emerald-50 rounded-2xl flex items-center justify-center">
                        <Icon className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(service)}
                          className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-gray-800 font-bold text-base mb-1">
                      {service.name}
                    </h3>
                    <p className="text-xs text-gray-400 h-8 line-clamp-2">
                      {service.description || "No description provided."}
                    </p>

                    <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-end">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                          Price
                        </p>
                        <p className="text-xl font-bold text-gray-800">
                          ₹{service.price}
                          <span className="text-sm font-normal text-gray-400">
                            {" "}
                            / {service.unit}
                          </span>
                        </p>
                      </div>
                      <Badge
                        className={`rounded-full text-[10px] font-semibold px-3 ${
                          service.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {service.isActive ? "Active" : "Hidden"}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
