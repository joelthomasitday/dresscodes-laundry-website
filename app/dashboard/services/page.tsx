"use client";

import { useEffect, useState } from "react";
import { useDashboardAuth } from "@/contexts/dashboard-auth-context";
import { DashboardNav } from "@/components/dashboard-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit2, Loader2, Save, X, Package } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface ServiceItem {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  isActive: boolean;
}

export default function ServicesPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useDashboardAuth();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Laundry",
    price: 0,
    unit: "piece"
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
        setFormData({ name: "", description: "", category: "Laundry", price: 0, unit: "piece" });
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
      unit: service.unit
    });
    setIsAdding(true);
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-gray-950">
      <DashboardNav />
      <main className="pt-14 md:pt-0 md:ml-64">
        <div className="p-4 md:p-6 lg:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">Services</h1>
              <p className="text-sm text-gray-400">Manage your laundry service catalog</p>
            </div>
            {!isAdding && (
              <Button onClick={() => setIsAdding(true)} className="bg-emerald-600 hover:bg-emerald-700 rounded-xl">
                <Plus className="h-4 w-4 mr-2" /> Add Service
              </Button>
            )}
          </div>

          {isAdding && (
            <Card className="bg-gray-900 border-emerald-500/50">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white">{editingId ? "Edit Service" : "New Service"}</h2>
                    <Button type="button" variant="ghost" size="icon" onClick={() => {setIsAdding(false); setEditingId(null);}} className="text-gray-400">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-400">Service Name</Label>
                      <Input 
                        required
                        className="bg-gray-800 border-gray-700 text-white rounded-xl"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-gray-400">Category</Label>
                       <Select 
                        value={formData.category} 
                        onValueChange={(v) => setFormData({...formData, category: v})}
                       >
                         <SelectTrigger className="bg-gray-800 border-gray-700 text-white rounded-xl">
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent className="bg-gray-900 border-gray-800 text-white">
                           <SelectItem value="Laundry">Laundry</SelectItem>
                           <SelectItem value="Dry Cleaning">Dry Cleaning</SelectItem>
                           <SelectItem value="Premium Care">Premium Care</SelectItem>
                           <SelectItem value="Ironing">Ironing</SelectItem>
                         </SelectContent>
                       </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-400">Price (₹)</Label>
                      <Input 
                        type="number"
                        required
                        className="bg-gray-800 border-gray-700 text-white rounded-xl"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-400">Unit (e.g. piece, kg, pair)</Label>
                      <Input 
                        required
                        className="bg-gray-800 border-gray-700 text-white rounded-xl"
                        value={formData.unit}
                        onChange={(e) => setFormData({...formData, unit: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-gray-400">Description</Label>
                      <Input 
                        className="bg-gray-800 border-gray-700 text-white rounded-xl"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" disabled={submitting} className="flex-1 bg-emerald-600 hover:bg-emerald-700 rounded-xl h-12">
                      {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5 mr-2" />}
                      {editingId ? "Update Product" : "Save Product"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 bg-gray-900 rounded-2xl" />)}
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20 bg-gray-900 rounded-2xl border border-gray-800">
              <Package className="h-12 w-12 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-400">No services found in your catalog</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <Card key={service._id} className="bg-gray-900 border-gray-800 hover:border-emerald-500/30 transition-all">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className="bg-emerald-500/10 text-emerald-500 rounded-full font-medium">
                        {service.category}
                      </Badge>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(service)} className="h-8 w-8 text-gray-400 hover:text-white rounded-lg">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-400 rounded-lg">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <h3 className="text-white font-bold text-lg">{service.name}</h3>
                    <p className="text-xs text-gray-500 h-8 line-clamp-2 mt-1">{service.description || "No description provided."}</p>
                    <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-end">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-tighter">Price</p>
                        <p className="text-xl font-black text-white">₹{service.price}<span className="text-sm font-normal text-gray-600"> / {service.unit}</span></p>
                      </div>
                      <Badge className={service.isActive ? "bg-emerald-500" : "bg-gray-700"}>
                        {service.isActive ? "Active" : "Hidden"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
