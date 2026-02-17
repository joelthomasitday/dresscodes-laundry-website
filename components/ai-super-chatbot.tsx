"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  ImagePlus,
  Shirt,
  DollarSign,
  CalendarCheck,
  Package,
  HelpCircle,
  MessageSquare,
  Zap,
  Camera,
  Trash2,
  ArrowRight,
  Star,
  CheckCircle2,
  AlertCircle,
  Phone,
  MapPin,
  UserCircle,
  Clock,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

// ── Types (new multi-garment schema) ───────────────────────────
interface GarmentDetail {
  cloth_type: string | null;
  category: string | null;
  fabric_type: string;
  stain_detected: boolean | null;
  stain_type: string;
  complexity_level: string | null;
}

interface StructuredResponse {
  intent: string;
  garments: GarmentDetail[];
  total_quantity_estimate: number | null;
  service_recommendation: {
    recommended_service: string | null;
    express_recommended: boolean | null;
  };
  pricing: {
    estimated_total_price: number | null;
  };
  customer_details: {
    name: string | null;
    phone: string | null;
    address: string | null;
  };
  booking_status?: string | null;
  missing_fields?: string[];
  booking_id?: string;
  response_message: string;
  confidence_score: number;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: string;       // Legacy single image
  images?: string[];    // NEW: multiple images
  structuredData?: StructuredResponse;
  timestamp: Date;
}

// ── Intent Config ──────────────────────────────────────────────
const INTENT_CONFIG: Record<string, { icon: React.ElementType; color: string; bgColor: string; label: string }> = {
  cloth_analysis: { icon: Shirt, color: "text-violet-600", bgColor: "bg-violet-50 border-violet-100", label: "Garment Analysis" },
  price_estimate: { icon: DollarSign, color: "text-emerald-600", bgColor: "bg-emerald-50 border-emerald-100", label: "Price Estimate" },
  create_booking: { icon: CalendarCheck, color: "text-blue-600", bgColor: "bg-blue-50 border-blue-100", label: "Booking Assistant" },
  track_order: { icon: Package, color: "text-amber-600", bgColor: "bg-amber-50 border-amber-100", label: "Order Tracking" },
  faq: { icon: HelpCircle, color: "text-cyan-600", bgColor: "bg-cyan-50 border-cyan-100", label: "FAQ" },
  general_chat: { icon: MessageSquare, color: "text-slate-600", bgColor: "bg-slate-50 border-slate-100", label: "General" },
};

// ── Quick action suggestions ──────────────────────────────────
const QUICK_ACTIONS = [
  { label: "📷 Analyze Garment", message: "", isImageTrigger: true },
  { label: "💰 Get Price Quote", message: "What are your pricing options?" },
  { label: "📅 Book Pickup", message: "I want to book a laundry pickup" },
  { label: "📦 Track Order", message: "I want to track my order" },
  { label: "❓ Services Info", message: "What services do you offer?" },
];

// ── Missing field icon map ────────────────────────────────────
const MISSING_FIELD_ICON: Record<string, React.ElementType> = {
  name: UserCircle,
  phone: Phone,
  address: MapPin,
  cloth_type: Shirt,
  service: Sparkles,
};

// ── ID Generator ───────────────────────────────────────────────
let idCounter = 0;
function generateId() {
  return `msg_${Date.now()}_${++idCounter}`;
}

// ── Component ──────────────────────────────────────────────────
export function AiSuperChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingImages, setPendingImages] = useState<{ url: string; name: string }[]>([]);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize welcome message only on client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    setMessages([
      {
        id: generateId(),
        role: "assistant",
        content: "Welcome to DressCodes! 👕✨ I'm your AI laundry assistant. I can analyze garments from photos, estimate prices, help book pickups, track orders, and answer any questions. What can I help you with?",
        timestamp: new Date(),
      },
    ]);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // ── Multi-image upload handler ──────────────────────────────
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: { url: string; name: string }[] = [];
    let processed = 0;

    const fileArray = Array.from(files).slice(0, 5); // Max 5 images at once

    for (const file of fileArray) {
      if (file.size > 10 * 1024 * 1024) {
        alert(`"${file.name}" is larger than 10MB. Skipping.`);
        processed++;
        continue;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push({ url: reader.result as string, name: file.name });
        processed++;
        if (processed === fileArray.length) {
          setPendingImages((prev) => [...prev, ...newImages].slice(0, 5));
        }
      };
      reader.readAsDataURL(file);
    }

    e.target.value = "";
  }, []);

  const removePendingImage = useCallback((index: number) => {
    setPendingImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearAllPendingImages = useCallback(() => {
    setPendingImages([]);
  }, []);

  // ── Send message with multi-image support ───────────────────
  const sendMessage = useCallback(async (textOverride?: string, imagesOverride?: string[]) => {
    const text = textOverride ?? input;
    const images = imagesOverride ?? pendingImages.map((p) => p.url);

    if (!text.trim() && images.length === 0) return;
    if (isLoading) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content: text.trim() || (images.length > 0 ? `Please analyze ${images.length > 1 ? "these" : "this"} garment image${images.length > 1 ? "s" : ""}.` : ""),
      images: images.length > 0 ? images : undefined,
      image: images.length === 1 ? images[0] : undefined, // backward compat
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setPendingImages([]);
    setIsLoading(true);
    setShowQuickActions(false);

    try {
      const apiMessages = messages
        .concat(userMessage)
        .map((m) => ({
          role: m.role,
          content: m.content,
          image: m.image || undefined,
          images: m.images || undefined,
          structuredData: m.structuredData || undefined,
        }));

      const response = await fetch("/api/super-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await response.json();
      const structured: StructuredResponse = data.fallback || data;

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: structured.response_message || "I'm here to help!",
        structuredData: structured,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Super chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: "assistant",
          content: "Sorry, I'm having trouble connecting right now. Please try again or contact us on WhatsApp!",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, pendingImages, isLoading, messages]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    sendMessage();
  };

  const handleQuickAction = (action: typeof QUICK_ACTIONS[0]) => {
    if (action.isImageTrigger) {
      fileInputRef.current?.click();
    } else {
      sendMessage(action.message);
    }
  };

  // ── Render Helpers ─────────────────────────────────────────
  const renderIntentBadge = (intent: string) => {
    const config = INTENT_CONFIG[intent] || INTENT_CONFIG.general_chat;
    const Icon = config.icon;
    return (
      <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border", config.bgColor, config.color)}>
        <Icon className="h-3 w-3" />
        {config.label}
      </div>
    );
  };

  // ── NEW: Render multiple garments ───────────────────────────
  const renderGarments = (data: StructuredResponse) => {
    if (!data.garments || data.garments.length === 0) return null;
    // Filter out garments with no meaningful data
    const validGarments = data.garments.filter((g) => g.cloth_type);
    if (validGarments.length === 0) return null;

    return (
      <div className="mt-2.5 space-y-2">
        {validGarments.map((garment, index) => (
          <div key={index} className="p-3 rounded-xl bg-white border border-slate-100 space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <Shirt className="h-3 w-3" />
                {validGarments.length > 1 ? `Garment ${index + 1}` : "Garment Details"}
              </div>
              {validGarments.length > 1 && (
                <Badge variant="outline" className="text-[9px] bg-violet-50 border-violet-100 text-violet-600">
                  {index + 1}/{validGarments.length}
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Type:</span>
                <span className="ml-1 font-bold text-slate-700 capitalize">{garment.cloth_type}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Category:</span>
                <Badge variant="outline" className="ml-1 text-[10px] capitalize bg-teal-50 border-teal-100 text-teal-700">{garment.category || "unknown"}</Badge>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Fabric:</span>
                <span className="ml-1 font-semibold text-slate-600 capitalize">{garment.fabric_type}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Complexity:</span>
                <Badge variant="outline" className={cn("ml-1 text-[10px] capitalize",
                  garment.complexity_level === "high" ? "bg-red-50 border-red-100 text-red-600" :
                  garment.complexity_level === "medium" ? "bg-amber-50 border-amber-100 text-amber-600" :
                  "bg-green-50 border-green-100 text-green-600"
                )}>{garment.complexity_level || "N/A"}</Badge>
              </div>
            </div>
            {garment.stain_detected && (
              <div className="flex items-center gap-2 mt-1 px-2.5 py-1.5 bg-orange-50 border border-orange-100 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-xs font-bold text-orange-700">
                  Stain Detected: {garment.stain_type !== "none" ? garment.stain_type : "Unknown type"}
                </span>
              </div>
            )}
            {garment.stain_detected === false && (
              <div className="flex items-center gap-2 mt-1 px-2.5 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-emerald-700">No stains detected</span>
              </div>
            )}
          </div>
        ))}
        {/* Quantity summary */}
        {data.total_quantity_estimate && data.total_quantity_estimate > 1 && (
          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">Total garments:</span>
            <span className="font-bold text-slate-700">{data.total_quantity_estimate} items</span>
          </div>
        )}
      </div>
    );
  };

  const renderServiceRecommendation = (data: StructuredResponse) => {
    if (!data.service_recommendation?.recommended_service) return null;
    return (
      <div className="mt-2 p-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-teal-200 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Recommended Service
            </div>
            <p className="text-base font-black capitalize mt-0.5 tracking-tight">
              {data.service_recommendation.recommended_service.replace(/_/g, " ")}
            </p>
          </div>
          {data.service_recommendation.express_recommended && (
            <Badge className="bg-yellow-400 text-yellow-900 border-none text-[10px] font-black gap-1">
              <Zap className="h-3 w-3" /> Express
            </Badge>
          )}
        </div>
      </div>
    );
  };

  const renderPricing = (data: StructuredResponse) => {
    if (!data.pricing?.estimated_total_price) return null;
    return (
      <div className="mt-2 p-3 rounded-xl bg-white border border-emerald-100 shadow-sm">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1 mb-2">
          <DollarSign className="h-3 w-3" /> Price Estimate
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-700 font-bold">Estimated Total</span>
            <span className="text-lg font-black text-emerald-600">₹{data.pricing.estimated_total_price}</span>
          </div>
          {data.garments && data.garments.length > 1 && (
            <p className="text-[10px] text-slate-400 italic">
              Price includes {data.garments.length} garment{data.garments.length > 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>
    );
  };

  // ── Booking status rendering ────────────────────────────────
  const renderBookingStatus = (data: StructuredResponse) => {
    if (!data.booking_status) return null;

    // ── Booking Created Successfully ──
    if (data.booking_status === "created") {
      return (
        <div className="mt-2 p-3 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-md space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* Success header */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-black text-green-800 uppercase tracking-wider">Booking Confirmed!</p>
              {data.booking_id && (
                <p className="text-[11px] font-mono font-bold text-green-600">{data.booking_id}</p>
              )}
            </div>
          </div>

          {/* Booking details card */}
          <div className="space-y-1.5 text-xs">
            {data.customer_details?.name && (
              <div className="flex items-center gap-2 text-green-800">
                <UserCircle className="h-3.5 w-3.5 text-green-500" />
                <span className="font-semibold">{data.customer_details.name}</span>
              </div>
            )}
            {data.customer_details?.address && (
              <div className="flex items-center gap-2 text-green-800">
                <MapPin className="h-3.5 w-3.5 text-green-500" />
                <span className="font-medium">{data.customer_details.address}</span>
              </div>
            )}
            {data.customer_details?.phone && (
              <div className="flex items-center gap-2 text-green-800">
                <Phone className="h-3.5 w-3.5 text-green-500" />
                <span className="font-medium">{data.customer_details.phone}</span>
              </div>
            )}
            {data.service_recommendation?.recommended_service && (
              <div className="flex items-center gap-2 text-green-800">
                <Sparkles className="h-3.5 w-3.5 text-green-500" />
                <span className="font-bold capitalize">{data.service_recommendation.recommended_service.replace(/_/g, " ")}</span>
              </div>
            )}
            {data.garments && data.garments.length > 0 && (
              <div className="flex items-center gap-2 text-green-800">
                <Shirt className="h-3.5 w-3.5 text-green-500" />
                <span className="font-medium capitalize">
                  {data.garments.filter((g) => g.cloth_type).map((g) => g.cloth_type).join(", ") || "As described"}
                </span>
              </div>
            )}
            {data.pricing?.estimated_total_price != null && (
              <div className="flex items-center gap-2 text-green-800">
                <DollarSign className="h-3.5 w-3.5 text-green-500" />
                <span className="font-black text-base text-emerald-700">₹{data.pricing.estimated_total_price}</span>
              </div>
            )}
          </div>

          {/* Track order button */}
          <div className="pt-1">
            <button
              className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md active:scale-[0.98]"
              onClick={() => {
                if (data.booking_id) {
                  sendMessage(`Track my order ${data.booking_id}`);
                }
              }}
            >
              <Package className="h-3.5 w-3.5" />
              Track Your Order
            </button>
          </div>
        </div>
      );
    }

    // ── Missing Information ──
    if (data.booking_status === "missing_information" && data.missing_fields && data.missing_fields.length > 0) {
      return (
        <div className="mt-2 p-3 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 shadow-sm space-y-2 animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
              <AlertCircle className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black text-amber-800 uppercase tracking-wider">Information Needed</p>
              <p className="text-[10px] text-amber-600">Please provide the following to confirm booking</p>
            </div>
          </div>

          <div className="space-y-1">
            {data.missing_fields.map((field) => {
              const Icon = MISSING_FIELD_ICON[field] || AlertCircle;
              const labels: Record<string, string> = {
                name: "Your Name",
                phone: "Phone Number",
                address: "Pickup Address",
                cloth_type: "Garment Type",
                service: "Preferred Service",
              };
              return (
                <div
                  key={field}
                  className="flex items-center gap-2 px-2.5 py-1.5 bg-white/80 rounded-lg border border-amber-100"
                >
                  <Icon className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-xs font-semibold text-amber-800">{labels[field] || field}</span>
                  <span className="ml-auto text-[9px] text-amber-400 font-bold uppercase">Required</span>
                </div>
              );
            })}
          </div>

          {/* Show what we already have */}
          {data.customer_details && (data.customer_details.name || data.customer_details.phone || data.customer_details.address) && (
            <div className="mt-1.5 pt-1.5 border-t border-amber-200/60">
              <p className="text-[9px] font-bold text-amber-500 uppercase tracking-wider mb-1">Already Captured</p>
              <div className="flex flex-wrap gap-1.5">
                {data.customer_details.name && (
                  <Badge variant="outline" className="text-[10px] bg-green-50 border-green-200 text-green-700 gap-1">
                    <CheckCircle2 className="h-2.5 w-2.5" /> {data.customer_details.name}
                  </Badge>
                )}
                {data.customer_details.phone && (
                  <Badge variant="outline" className="text-[10px] bg-green-50 border-green-200 text-green-700 gap-1">
                    <CheckCircle2 className="h-2.5 w-2.5" /> {data.customer_details.phone}
                  </Badge>
                )}
                {data.customer_details.address && (
                  <Badge variant="outline" className="text-[10px] bg-green-50 border-green-200 text-green-700 gap-1">
                    <CheckCircle2 className="h-2.5 w-2.5" /> {data.customer_details.address}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  const renderBookingAction = (data: StructuredResponse) => {
    // Don't show "Book Now" link if we're already in the booking flow
    if (data.booking_status === "created" || data.booking_status === "missing_information") return null;
    if (data.intent !== "create_booking" && data.intent !== "cloth_analysis") return null;
    // Show booking action if garments are detected
    if (data.intent === "cloth_analysis" && (!data.garments || data.garments.length === 0)) return null;
    return (
      <div className="mt-2">
        <button
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition-all hover:-translate-y-0.5 shadow-lg active:scale-[0.98]"
          onClick={() => sendMessage("I want to book a pickup for this")}
        >
          <CalendarCheck className="h-4 w-4" />
          Start Booking
          <ArrowRight className="h-3 w-3 ml-auto" />
        </button>
      </div>
    );
  };

  const renderConfidenceScore = (score: number) => {
    if (score <= 0) return null;
    const percentage = Math.round(score * 100);
    const color = percentage >= 80 ? "text-emerald-500" : percentage >= 50 ? "text-amber-500" : "text-red-400";
    return (
      <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-400">
        <Star className={cn("h-3 w-3", color)} />
        <span>Confidence: {percentage}%</span>
      </div>
    );
  };

  // ── Main Render ────────────────────────────────────────────
  return (
    <>
      {/* Hidden file input — supports multiple */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleImageUpload}
      />

      <div className="fixed bottom-24 right-6 z-[60] flex flex-col items-end gap-4 pointer-events-none">
        {/* Chat Window */}
        <div
          className={cn(
            "transition-all duration-300 ease-in-out transform origin-bottom-right",
            isOpen
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-95 translate-y-4 pointer-events-none"
          )}
        >
          <div className="w-[370px] sm:w-[400px] shadow-2xl rounded-2xl overflow-hidden flex flex-col h-[560px] border border-slate-200/50 backdrop-blur-sm">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white p-4 flex items-center justify-between shrink-0 relative overflow-hidden">
              {/* Animated background dots */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute w-32 h-32 rounded-full bg-white/20 -top-16 -left-16 animate-pulse" />
                <div className="absolute w-24 h-24 rounded-full bg-white/10 -bottom-12 -right-12 animate-pulse" style={{ animationDelay: "1s" }} />
              </div>

              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-inner">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">DressCodes AI</h3>
                  <p className="text-[11px] text-emerald-100 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                    Online • Smart Booking
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 relative z-10">
                <Badge className="bg-white/15 text-white border-white/20 text-[9px] font-bold backdrop-blur-sm hidden sm:inline-flex">
                  <Sparkles className="h-2.5 w-2.5 mr-1" /> AI Powered
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 rounded-full h-8 w-8"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-hidden relative bg-gradient-to-b from-slate-50 to-white">
              <ScrollArea className="h-full w-full">
                <div className="flex flex-col gap-3 p-4 pb-2">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex gap-2.5 max-w-[88%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                        msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                      )}
                    >
                      {/* Avatar */}
                      <div
                        className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                          msg.role === "assistant"
                            ? "bg-gradient-to-br from-teal-500 to-emerald-600 text-white"
                            : "bg-gradient-to-br from-slate-600 to-slate-800 text-white"
                        )}
                      >
                        {msg.role === "assistant" ? (
                          <Bot className="h-3.5 w-3.5" />
                        ) : (
                          <User className="h-3.5 w-3.5" />
                        )}
                      </div>

                      {/* Message Content */}
                      <div className="flex flex-col gap-1 min-w-0">
                        {/* Multi-image preview for user messages */}
                        {msg.images && msg.images.length > 0 && (
                          <div className={cn(
                            "flex gap-1.5 flex-wrap",
                            msg.images.length > 2 ? "grid grid-cols-2" : "flex"
                          )}>
                            {msg.images.map((imgUrl, imgIdx) => (
                              <div key={imgIdx} className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-slate-200 shadow-sm">
                                <Image src={imgUrl} alt={`Garment ${imgIdx + 1}`} fill className="object-cover" />
                                {msg.images && msg.images.length > 1 && (
                                  <div className="absolute top-1 right-1 bg-black/60 rounded-full w-4 h-4 flex items-center justify-center">
                                    <span className="text-[8px] text-white font-bold">{imgIdx + 1}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        {/* Legacy single image fallback */}
                        {!msg.images && msg.image && (
                          <div className="relative w-40 h-28 rounded-xl overflow-hidden border-2 border-slate-200 shadow-sm">
                            <Image src={msg.image} alt="Uploaded garment" fill className="object-cover" />
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/40 to-transparent p-1.5">
                              <span className="text-[9px] text-white font-bold flex items-center gap-1">
                                <Camera className="h-2.5 w-2.5" /> Image attached
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Text bubble */}
                        <div
                          className={cn(
                            "rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm",
                            msg.role === "user"
                              ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-tr-md"
                              : "bg-white text-slate-700 border border-slate-100 rounded-tl-md"
                          )}
                        >
                          {msg.content.split("\n").map((line, i) => (
                            <span key={i}>
                              {line.replace(/\*\*(.*?)\*\*/g, "$1")}
                              {i < msg.content.split("\n").length - 1 && <br />}
                            </span>
                          ))}
                        </div>

                        {/* Structured Data Cards (for assistant messages) */}
                        {msg.structuredData && (
                          <div className="space-y-0.5">
                            {renderIntentBadge(msg.structuredData.intent)}
                            {renderGarments(msg.structuredData)}
                            {renderServiceRecommendation(msg.structuredData)}
                            {renderPricing(msg.structuredData)}
                            {renderBookingStatus(msg.structuredData)}
                            {renderBookingAction(msg.structuredData)}
                            {renderConfidenceScore(msg.structuredData.confidence_score)}
                          </div>
                        )}

                        {/* Timestamp — only render on client to avoid hydration mismatch */}
                        {mounted && (
                          <span suppressHydrationWarning className={cn("text-[9px] mt-0.5", msg.role === "user" ? "text-right text-slate-400" : "text-slate-300")}>
                            {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isLoading && (
                    <div className="flex gap-2.5 max-w-[88%] animate-in fade-in duration-200">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <Bot className="h-3.5 w-3.5" />
                      </div>
                      <div className="bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium ml-1">Analyzing...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quick Actions (shown at start) */}
                  {showQuickActions && messages.length <= 1 && !isLoading && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-bottom-3 duration-500" style={{ animationDelay: "400ms" }}>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Quick Actions</p>
                      <div className="flex flex-wrap gap-1.5">
                        {QUICK_ACTIONS.map((action, i) => (
                          <button
                            key={i}
                            onClick={() => handleQuickAction(action)}
                            className="px-3 py-1.5 text-[11px] font-semibold rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700 transition-all shadow-sm hover:shadow active:scale-95"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div ref={scrollRef} />
                </div>
              </ScrollArea>
            </div>

            {/* Pending Images Preview (multi-image) */}
            {pendingImages.length > 0 && (
              <div className="px-3 pt-2 pb-0 bg-white border-t border-slate-100 shrink-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {pendingImages.length} image{pendingImages.length > 1 ? "s" : ""} ready
                  </span>
                  <div className="flex items-center gap-1">
                    {pendingImages.length < 5 && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[9px] font-bold text-teal-600 hover:text-teal-700 flex items-center gap-0.5 transition-colors"
                      >
                        <Plus className="h-3 w-3" /> Add more
                      </button>
                    )}
                    <button
                      onClick={clearAllPendingImages}
                      className="text-[9px] font-bold text-red-400 hover:text-red-500 ml-2 transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1.5">
                  {pendingImages.map((img, idx) => (
                    <div key={idx} className="relative shrink-0">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden border-2 border-slate-200 shadow-sm">
                        <Image src={img.url} alt={img.name} fill className="object-cover" />
                        {pendingImages.length > 1 && (
                          <div className="absolute top-0.5 left-0.5 bg-teal-600 rounded-full w-4 h-4 flex items-center justify-center">
                            <span className="text-[8px] text-white font-bold">{idx + 1}</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removePendingImage(idx)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-sm transition-colors"
                      >
                        <X className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-slate-100 shrink-0">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full text-slate-400 hover:text-teal-600 hover:bg-teal-50 shrink-0 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  <ImagePlus className="h-4.5 w-4.5" />
                </Button>
                <Input
                  ref={inputRef}
                  placeholder={pendingImages.length > 0 ? "Add a message or just send..." : "Ask about laundry, pricing, or upload photos..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="rounded-full border-slate-200 focus-visible:ring-teal-500 bg-slate-50 text-sm h-9"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={(!input.trim() && pendingImages.length === 0) || isLoading}
                  className="h-9 w-9 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-md shrink-0 transition-all active:scale-95 disabled:opacity-40"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
              <p className="text-center text-[9px] text-slate-300 mt-1.5">
                Powered by DressCodes AI • Smart Booking
              </p>
            </div>
          </div>
        </div>

        {/* Floating Action Button — Open */}
        <Button
          size="lg"
          className={cn(
            "h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 pointer-events-auto group relative",
            isOpen
              ? "bg-slate-800 hover:bg-slate-900 rotate-90 scale-0 opacity-0 absolute"
              : "bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 rotate-0 scale-100 opacity-100"
          )}
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="h-7 w-7 text-white" />
          <span className="sr-only">Open AI Chat</span>

          {/* Animated notification dot */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-400 border-2 border-white items-center justify-center">
              <Sparkles className="h-2 w-2 text-white" />
            </span>
          </span>

          {/* Tooltip */}
          <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[11px] font-semibold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-xl">
            AI Laundry Assistant
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
          </div>
        </Button>

        {/* FAB — Close */}
        <Button
          size="lg"
          className={cn(
            "h-14 w-14 rounded-full shadow-lg bg-slate-800 hover:bg-slate-900 transition-all duration-300 absolute pointer-events-auto",
            isOpen ? "scale-100 opacity-100 rotate-0" : "scale-0 opacity-0 -rotate-90 pointer-events-none"
          )}
          onClick={() => setIsOpen(false)}
        >
          <X className="h-7 w-7 text-white" />
        </Button>
      </div>
    </>
  );
}
