"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  CalendarIcon, 
  Clock, 
  Phone, 
  CreditCard, 
  Loader2, 
  ChevronRight, 
  ChevronLeft, 
  ShoppingCart, 
  MapPin, 
  User, 
  Search, 
  X, 
  Plus, 
  Minus,
  CheckCircle2,
  Sparkles,
  Zap,
  Ticket,
  Waves,
  Crown
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { getTelHref, getWhatsAppHref, PHONE_DISPLAY } from "@/lib/phone";
import { useIsMobile } from "@/hooks/use-mobile";
import { pricingData, PricingItem } from "@/lib/pricing-data";
import { cn } from "@/lib/utils";

interface CartItem extends PricingItem {
  quantity: number;
  category: string;
}

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  
  // Flow State
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Step 1: Items State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Step 2 & 3: Info State
  const [formData, setFormData] = useState({
    name: searchParams.get("name") || "",
    phone: searchParams.get("phone") || "",
    email: "",
    address: searchParams.get("address") || "",
    pickupDate: undefined as Date | undefined,
    timeSlot: "",
    specialInstructions: "",
    useCurrentLocation: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationCoords, setLocationCoords] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null });

  // Service Selection State
  const [serviceType, setServiceType] = useState<"wash-iron" | "dry-clean" | "ironing" | "premium">("dry-clean");
  const [estWeight, setEstWeight] = useState(1);

  const mainServices = [
    { id: "wash-iron", title: "Wash & Iron", price: 160, unit: "kg", icon: <Waves className="h-5 w-5" /> },
    { id: "dry-clean", title: "Dry Clean", price: 100, unit: "pc", icon: <Sparkles className="h-5 w-5" /> },
    { id: "ironing", title: "Ironing", price: 20, unit: "pc", icon: <Zap className="h-5 w-5" /> },
    { id: "premium", title: "Premium", price: 220, unit: "kg", icon: <Crown className="h-5 w-5" /> },
  ];

  // Categories for Step 1
  const categories = ["All", ...Object.keys(pricingData)];
  
  // Filtered items logic
  const filteredItems = useMemo(() => {
    let items: { item: PricingItem; category: string }[] = [];
    
    if (selectedCategory === "All") {
      Object.entries(pricingData).forEach(([cat, catItems]) => {
        catItems.forEach(item => items.push({ item, category: cat }));
      });
    } else {
      pricingData[selectedCategory]?.forEach(item => items.push({ item, category: selectedCategory }));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      items = items.filter(i => i.item.Item.toLowerCase().includes(query));
    }
    
    return items;
  }, [selectedCategory, searchQuery]);

  // Sync AI Chatbot data
  useEffect(() => {
    const service = searchParams.get("service");
    if (service && cart.length === 0) {
      // If coming from AI with a recommended service, we can pre-add it if matched
      // For now, we'll just show the items screen but pre-fill customer info
    }
  }, [searchParams]);

  // Cart Helpers
  const addToCart = (item: PricingItem, category: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.SNo === item.SNo);
      if (existing) {
        return prev.map(i => i.SNo === item.SNo ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, category }];
    });
    toast({
      title: "Added to booking",
      description: `${item.Item} added.`,
      duration: 1500,
    });
  };

  const updateQuantity = (sno: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.SNo === sno) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(i => i.quantity > 0));
  };

  const totalItems = useMemo(() => {
    if (serviceType === "wash-iron" || serviceType === "premium") return 1;
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart, serviceType]);

  const totalPrice = useMemo(() => {
    if (serviceType === "wash-iron") return estWeight * 160;
    if (serviceType === "premium") return estWeight * 220;
    if (serviceType === "ironing") return cart.reduce((sum, item) => sum + (item.quantity * 20), 0);
    return cart.reduce((sum, item) => sum + (item.quantity * item.Price), 0);
  }, [cart, serviceType, estWeight]);

  const formatPrice = (price: number) => price.toLocaleString('en-IN');

  // Form Handlers
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleLocationToggle = (checked: boolean) => {
    handleInputChange("useCurrentLocation", checked);
    if (checked && "geolocation" in navigator) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setIsLoadingLocation(false);
          toast({ title: "Location detected", variant: "success" });
        },
        () => {
          setIsLoadingLocation(false);
          handleInputChange("useCurrentLocation", false);
          toast({ title: "Location failed", description: "Please enter manually", variant: "destructive" });
        }
      );
    }
  };

  const validateStep = (s: number) => {
    const newErrors: Record<string, string> = {};
    if (s === 1) {
      const isWeightBased = serviceType === "wash-iron" || serviceType === "premium";
      if (!isWeightBased && cart.length === 0) {
        toast({ title: "Cart empty", description: "Please add at least one item.", variant: "destructive" });
        return false;
      }
      return true; // Weight-based is always valid as it defaults to 1kg
    }
    if (s === 2) {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.phone.trim()) newErrors.phone = "Phone is required";
      if (!formData.address.trim() && !formData.useCurrentLocation) newErrors.address = "Address is required";
    }
    if (s === 3) {
      if (!formData.pickupDate) newErrors.pickupDate = "Select a date";
      if (!formData.timeSlot) newErrors.timeSlot = "Select a time";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    setIsSubmitting(true);

    try {
      const isWeightBased = serviceType === "wash-iron" || serviceType === "premium";
      
      const payloadServices = isWeightBased 
        ? [{
            serviceId: serviceType,
            name: serviceType === "wash-iron" ? "Wash & Iron" : "Premium Care",
            price: serviceType === "wash-iron" ? 160 : 220,
            quantity: estWeight,
            category: "Laundry"
          }]
        : cart.map(i => ({ 
            serviceId: i.SNo.toString(),
            name: i.Item, 
            price: serviceType === "ironing" ? 20 : i.Price, 
            quantity: i.quantity,
            category: i.category
          }));

      const orderData = {
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          location: formData.useCurrentLocation ? locationCoords : null
        },
        services: payloadServices,
        pickupDate: formData.pickupDate?.toISOString(),
        pickupTimeSlot: formData.timeSlot,
        notes: formData.specialInstructions,
        totalAmount: totalPrice
      };

      // 1. Send to API for Database entry
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      // 2. Format WhatsApp Message
      let waMessage = `*New Order from Website*\n\n`;
      waMessage += `*Order ID:* ${result.order.orderNumber}\n`;
      waMessage += `*Customer:* ${formData.name}\n`;
      waMessage += `*Phone:* ${formData.phone}\n`;
      waMessage += `*Address:* ${formData.address}\n`;
      if (formData.useCurrentLocation && locationCoords.lat) {
        waMessage += `*GPS:* https://maps.google.com/?q=${locationCoords.lat},${locationCoords.lng}\n`;
      }
      waMessage += `*Pickup:* ${format(formData.pickupDate!, "dd MMM")} | ${formData.timeSlot}\n\n`;
      waMessage += `*Items:*\n`;
      cart.forEach((item, idx) => {
        waMessage += `${idx + 1}. ${item.Item} (x${item.quantity}) - ₹${formatPrice(item.Price * item.quantity)}\n`;
      });
      waMessage += `\n*Total: ₹${formatPrice(totalPrice)}*`;

      // 3. Success Toast & Redirect/WhatsApp
      toast({ title: "Booking Successful!", description: "Opening WhatsApp to confirm..." });
      
      setTimeout(() => {
        window.open(getWhatsAppHref(waMessage), '_blank');
        router.push(`/track/${result.order.orderNumber}`);
      }, 1000);

    } catch (err: any) {
      toast({ title: "Booking Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // UI Components
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3].map((s) => (
        <div 
          key={s} 
          className={cn(
            "h-1.5 w-12 rounded-full transition-all duration-300",
            step >= s ? "bg-emerald-600" : "bg-gray-200"
          )} 
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navigation variant="solid" />

      {/* Header */}
      <div className="pt-24 pb-12 bg-emerald-900 text-white text-center rounded-b-[40px] shadow-xl">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">
            {step === 1 && "Choose Your Items"}
            {step === 2 && "Where should we pick up?"}
            {step === 3 && "Finalize Your Order"}
          </h1>
          <p className="text-emerald-100/80 text-sm">
            {step === 1 && "Select the clothes you'd like us to clean."}
            {step === 2 && "Enter your contact and address details."}
            {step === 3 && "Almost done! Choose a time for pickup."}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8">
        <StepIndicator />

        {/* STEP 1: SERVICE & ITEM SELECTION */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Main Service Selection */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {mainServices.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setServiceType(s.id as any)}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all gap-2 h-32",
                    serviceType === s.id 
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-inner" 
                      : "border-gray-100 bg-white text-gray-400 hover:border-emerald-200"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-2xl transition-colors",
                    serviceType === s.id ? "bg-emerald-600 text-white" : "bg-gray-100"
                  )}>
                    {s.title === "Wash & Iron" && <Waves className="h-6 w-6" />}
                    {s.title === "Dry Clean" && <Sparkles className="h-6 w-6" />}
                    {s.title === "Ironing" && <Zap className="h-6 w-6" />}
                    {s.title === "Premium" && <Crown className="h-6 w-6" />}
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">{s.title}</span>
                  <span className="text-[10px] font-bold opacity-60">₹{s.price}/{s.unit}</span>
                </button>
              ))}
            </div>

            {(serviceType === "wash-iron" || serviceType === "premium") && (
              <Card className="rounded-[32px] border-none shadow-lg bg-white p-8 text-center space-y-4">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                  <Waves className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Est. Weight (Kg)</h3>
                <p className="text-gray-500 text-sm">How much laundry are we talking about? <br/>(Actual weight will be measured at pickup)</p>
                <div className="flex items-center justify-center gap-6">
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="h-16 w-16 rounded-3xl border-2 border-gray-100 hover:border-emerald-600"
                    onClick={() => setEstWeight(Math.max(1, estWeight - 1))}
                  >
                    <Minus className="h-6 w-6" />
                  </Button>
                  <span className="text-5xl font-black text-emerald-900 w-24">{estWeight}</span>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="h-16 w-16 rounded-3xl border-2 border-gray-100 hover:border-emerald-600"
                    onClick={() => setEstWeight(estWeight + 1)}
                  >
                    <Plus className="h-6 w-6" />
                  </Button>
                </div>
              </Card>
            )}

            {(serviceType === "dry-clean" || serviceType === "ironing") && (
              <>
            {/* Search & Categories */}
            <div className="bg-white p-4 rounded-3xl shadow-sm space-y-4 sticky top-20 z-10 border border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder="Search garments..."
                  className="pl-10 rounded-full bg-gray-50 border-none h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
                {categories.map(cat => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    className={cn(
                      "rounded-full whitespace-nowrap px-6 h-9 transition-all text-sm font-medium",
                      selectedCategory === cat ? "bg-emerald-600 hover:bg-emerald-700 shadow-md scale-105" : "hover:bg-emerald-50"
                    )}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Item List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredItems.map(({ item, category }) => {
                const cartQty = cart.find(i => i.SNo === item.SNo)?.quantity || 0;
                return (
                  <Card key={item.SNo} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow group rounded-2xl">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-0.5 opacity-70">{category}</p>
                        <h4 className="font-bold text-gray-800 group-hover:text-emerald-700 transition-colors uppercase tracking-tight">{item.Item}</h4>
                        <p className="text-emerald-600 font-black text-lg">₹{item.Price}</p>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-emerald-50 p-1 rounded-full">
                        {cartQty > 0 ? (
                          <div className="flex items-center gap-3">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 rounded-full bg-white text-emerald-700 shadow-sm active:scale-90"
                              onClick={() => updateQuantity(item.SNo, -1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-black text-emerald-900 w-4 text-center">{cartQty}</span>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 rounded-full bg-white text-emerald-700 shadow-sm active:scale-90"
                              onClick={() => updateQuantity(item.SNo, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="ghost" 
                            className="bg-white text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-full px-4 h-10 font-bold shadow-sm active:scale-95"
                            onClick={() => addToCart(item, category)}
                          >
                            Add
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            </>
            )}
          </div>
        )}

        {/* STEP 2: ADDRESS & CONTACT */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <Card className="rounded-[32px] border-none shadow-lg overflow-hidden">
              <CardHeader className="bg-emerald-50 border-b border-emerald-100">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-emerald-600" />
                  Contact Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-700">Full Name *</Label>
                    <Input 
                      placeholder="e.g. Rahul Sharma" 
                      className="rounded-2xl h-12 bg-gray-50 border-none focus:ring-emerald-500" 
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                    {errors.name && <p className="text-red-500 text-xs font-medium pl-1">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-700">Phone Number *</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">+91</span>
                      <Input 
                        placeholder="10 digit number" 
                        className="rounded-2xl h-12 bg-gray-50 border-none pl-12 focus:ring-emerald-500"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs font-medium pl-1">{errors.phone}</p>}
                  </div>
                </div>
                
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <Label className="text-sm font-bold text-gray-700">Pickup Address *</Label>
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="location" 
                        checked={formData.useCurrentLocation} 
                        onCheckedChange={handleLocationToggle}
                      />
                      <Label htmlFor="location" className="text-xs font-medium cursor-pointer flex items-center gap-1 text-emerald-700">
                        <MapPin className="h-3 w-3" /> Use current location
                      </Label>
                    </div>
                  </div>
                  <Textarea 
                    placeholder="House No, Building, Landmark, Area..." 
                    className="rounded-2xl min-h-[100px] bg-gray-50 border-none focus:ring-emerald-500"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                  />
                  {errors.address && <p className="text-red-500 text-xs font-medium pl-1">{errors.address}</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* STEP 3: SCHEDULING & CONFIRM */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <Card className="rounded-[32px] border-none shadow-lg overflow-hidden">
              <CardHeader className="bg-emerald-50 border-b border-emerald-100">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-emerald-600" />
                  Pickup Slot
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-gray-700">Preferred Date *</Label>
                    <DatePicker 
                      date={formData.pickupDate} 
                      onDateChange={(d) => handleInputChange("pickupDate", d)}
                    />
                    {errors.pickupDate && <p className="text-red-500 text-xs font-medium pl-1">{errors.pickupDate}</p>}
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-gray-700">Time Window *</Label>
                    <Select onValueChange={(v) => handleInputChange("timeSlot", v)} defaultValue={formData.timeSlot}>
                      <SelectTrigger className="rounded-2xl h-12 bg-gray-50 border-none px-4 font-medium">
                        <SelectValue placeholder="Select a time slot" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-xl">
                        {["09:00 AM - 11:00 AM", "11:00 AM - 01:00 PM", "01:00 PM - 03:00 PM", "03:00 PM - 05:00 PM", "05:00 PM - 07:00 PM"].map(slot => (
                          <SelectItem key={slot} value={slot} className="rounded-xl my-1">{slot}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.timeSlot && <p className="text-red-500 text-xs font-medium pl-1">{errors.timeSlot}</p>}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <Label className="text-sm font-bold text-gray-700">Special Instructions (Optional)</Label>
                  <Textarea 
                    placeholder="e.g. Pick up from security, gentle wash for silk, etc." 
                    className="rounded-2xl bg-gray-50 border-none min-h-[80px]"
                    value={formData.specialInstructions}
                    onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Order Review */}
            <Card className="rounded-[32px] border-none shadow-lg bg-white overflow-hidden p-6 space-y-4">
              <h4 className="font-black uppercase tracking-widest text-gray-400 text-xs border-b pb-2">Order Review</h4>
              <div className="max-h-[200px] overflow-y-auto pr-2 space-y-3 thin-scrollbar">
                {serviceType === "wash-iron" || serviceType === "premium" ? (
                  <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border-l-4 border-emerald-500">
                    <div>
                      <p className="font-bold text-sm text-gray-800 uppercase tracking-tight leading-none">
                        {serviceType === "wash-iron" ? "Wash & Iron" : "Premium Care"}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Est. {estWeight} Kg</p>
                    </div>
                    <p className="font-black text-emerald-700">₹{formatPrice(totalPrice)}</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.SNo} className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl">
                      <div className="flex-1">
                        <p className="font-bold text-sm text-gray-800 uppercase tracking-tight leading-none">{item.Item}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                          {serviceType === "ironing" ? "Ironing" : "Dry Cleaning"} | ₹{serviceType === "ironing" ? 20 : item.Price} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-black text-emerald-700">₹{formatPrice((serviceType === "ironing" ? 20 : item.Price) * item.quantity)}</p>
                    </div>
                  ))
                )}
              </div>
              
              <div className="pt-4 border-t border-dashed flex justify-between items-end">
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Estimated</p>
                  <p className="text-3xl font-black text-emerald-800 tracking-tighter">₹{formatPrice(totalPrice)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">
                    {serviceType === "wash-iron" || serviceType === "premium" ? `${estWeight} Kg` : `${totalItems} Items`}
                  </p>
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none font-bold">Pay at Delivery</Badge>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Floating Action Bar (Mobile-First) */}
      <div className="fixed bottom-0 inset-x-0 p-4 bg-white/80 backdrop-blur-xl border-t border-gray-100 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          {step > 1 && (
            <Button 
              variant="outline" 
              className="h-14 w-14 rounded-full border-2 border-gray-100 p-0 hover:bg-gray-50 shrink-0"
              onClick={prevStep}
              disabled={isSubmitting}
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </Button>
          )}
          
          <Button 
            className={cn(
              "h-14 rounded-full flex-1 font-bold text-lg shadow-xl transition-all active:scale-[0.98]",
              step === 3 ? "bg-emerald-600 hover:bg-emerald-700" : "bg-black hover:bg-gray-800"
            )}
            onClick={step === 3 ? handleSubmit : nextStep}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                {step === 1 && "Next: Address"}
                {step === 2 && "Next: Pickup Time"}
                {step === 3 && "Confirm via WhatsApp"}
                <ChevronRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Mini Cart Floating (Only for Step 1) */}
      {step === 1 && cart.length > 0 && (
        <div className="fixed bottom-24 left-4 animate-in slide-in-from-left-10 duration-500">
          <Card className="bg-emerald-600 text-white rounded-full px-6 py-3 shadow-2xl border-none flex items-center gap-3">
            <ShoppingCart className="h-5 w-5" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase opacity-80 leading-none">Total</span>
              <span className="text-lg font-black leading-none">₹{formatPrice(totalPrice)}</span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <span className="font-bold text-sm">{totalItems}</span>
          </Card>
        </div>
      )}
      <Footer />
    </div>
  );
}
