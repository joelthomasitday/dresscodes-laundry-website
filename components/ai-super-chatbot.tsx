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
  Edit2,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { getWhatsAppHref } from "@/lib/phone";
import { FuturisticFab } from "./futuristic-fab";

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
  cloth_analysis: { icon: Shirt, color: "text-slate-600", bgColor: "bg-slate-50 border-slate-100", label: "Analysis" },
  price_estimate: { icon: DollarSign, color: "text-slate-600", bgColor: "bg-slate-50 border-slate-100", label: "Quote" },
  create_booking: { icon: CalendarCheck, color: "text-slate-600", bgColor: "bg-slate-50 border-slate-100", label: "Booking" },
  track_order: { icon: Package, color: "text-slate-600", bgColor: "bg-slate-50 border-slate-100", label: "Tracking" },
  faq: { icon: HelpCircle, color: "text-slate-600", bgColor: "bg-slate-50 border-slate-100", label: "FAQ" },
  general_chat: { icon: MessageSquare, color: "text-slate-600", bgColor: "bg-slate-50 border-slate-100", label: "Assistant" },
};

// Quick actions removed for premium minimal UI

// ── Missing field icon map ────────────────────────────────────
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
  </svg>
);

const MISSING_FIELD_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  name: UserCircle,
  phone: WhatsAppIcon,
  address: MapPin,
  cloth_type: Shirt,
  service: Sparkles,
};

const QUICK_ACTIONS = [
  { label: "Book Pickup", icon: CalendarCheck, message: "I want to book a pickup" },
  { label: "Price List", icon: DollarSign, message: "Show me the price list" },
  { label: "Track Order", icon: Package, message: "Track my order" },
  { label: "Analyze Cloth", icon: Camera, message: "Analyze my garment" },
  { label: "Express Wash", icon: Zap, message: "I need express laundry service" },
  { label: "How it Works", icon: HelpCircle, message: "How does DressCodes work?" },
];

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
        content: "Hi! I'm Sparky, your laundry pal. How can I help you today?",
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
      
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      const isTimeout = errorMessage.toLowerCase().includes("timeout") || errorMessage.toLowerCase().includes("abort");
      
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: "assistant",
          content: isTimeout 
            ? "The image analysis is taking a bit longer than expected. Please try a smaller image or check your connection!"
            : "I'm having a bit of trouble analyzing that right now. Could you try rephrasing or sending the photo again? You can also reach us on WhatsApp!",
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

  const handleQuickAction = (message: string) => {
    sendMessage(message);
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
    const validGarments = data.garments.filter((g) => g.cloth_type);
    if (validGarments.length === 0) return null;

    return (
      <div className="mt-4 space-y-4">
        {validGarments.map((garment, index) => (
          <div key={index} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3.5 ring-1 ring-slate-100/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
                <Shirt className="h-4 w-4 text-[#0F3F36]/40" />
                {validGarments.length > 1 ? `Garment ${index + 1}` : "Analysis Results"}
              </div>
              {validGarments.length > 1 && (
                <Badge className="bg-[#0F3F36] text-white border-none text-[10px] px-2.5 py-0.5 rounded-full">
                  {index + 1}/{validGarments.length}
                </Badge>
              )}
            </div>

            {/* Simple Vertical List Hierarchy (Zero Overlap Guaranteed) */}
            <div className="space-y-3 pt-1">
              <div className="flex flex-col gap-0.5 pb-2 border-b border-slate-50">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Garment Type</span>
                <span className="text-[15px] font-black text-slate-900 capitalize break-words leading-tight">
                  {garment.cloth_type}
                </span>
              </div>

              <div className="flex justify-between items-center gap-4 py-1.5 border-b border-slate-50">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider shrink-0">Fabric</span>
                <span className="text-[13px] font-bold text-slate-700 text-right break-words">
                  {(garment.fabric_type || "Standard").replace(/_/g, " ")}
                </span>
              </div>

              <div className="flex justify-between items-center gap-4 py-1.5 border-b border-slate-50">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider shrink-0">Style</span>
                <span className="text-[12px] font-black text-[#0F3F36] uppercase tracking-[0.05em] text-right">
                  {garment.category || "General"}
                </span>
              </div>

              <div className="flex justify-between items-center gap-4 py-1.5">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider shrink-0">Complexity</span>
                <Badge variant="outline" className="text-[10px] h-5 bg-slate-50 border-slate-200 text-slate-600 px-2 rounded-md font-black">
                  {garment.complexity_level || "Normal"}
                </Badge>
              </div>
            </div>

            {garment.stain_detected && (
              <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-100 rounded-xl mt-2">
                <div className="relative">
                  <div className="p-1 rounded-full bg-red-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                  </div>
                  <div className="absolute inset-0 w-full h-full rounded-full bg-red-400 animate-ping opacity-20" />
                </div>
                <span className="text-xs font-bold text-red-800">
                  Stain Found: {garment.stain_type !== "none" ? (garment.stain_type || "").replace(/_/g, " ") : "Detected"}
                </span>
              </div>
            )}
            
            {garment.stain_detected === false && (
              <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50/50 border border-emerald-100 rounded-xl mt-2">
                <div className="p-1 rounded-full bg-emerald-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                </div>
                <span className="text-xs font-bold text-emerald-800">Pristine - No stains found</span>
              </div>
            )}
          </div>
        ))}
        {data.total_quantity_estimate && data.total_quantity_estimate > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 rounded-2xl text-white shadow-lg overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] opacity-60">Session Total</span>
            <span className="text-base font-black tracking-tight">{data.total_quantity_estimate} Items</span>
          </div>
        )}
      </div>
    );
  };

  const renderServiceRecommendation = (data: StructuredResponse) => {
    if (!data.service_recommendation?.recommended_service) return null;
    return (
      <div className="mt-2 p-3 rounded-xl bg-[#0F3F36] text-white shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Recommended Service
            </div>
            <p className="text-base font-bold capitalize mt-0.5 tracking-tight">
              {data.service_recommendation.recommended_service.replace(/_/g, " ")}
            </p>
          </div>
          {data.service_recommendation.express_recommended && (
            <Badge className="bg-white/20 text-white border-none text-[10px] font-bold gap-1">
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
        <div className="mt-2 p-4 rounded-xl bg-white border border-[#0F3F36]/10 shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0F3F36] flex items-center justify-center shadow-md">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Booking Confirmed!</p>
              {data.booking_id && (
                <p className="text-[11px] font-mono text-slate-400">{data.booking_id}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600 pt-1">
            {data.customer_details?.name && (
              <div className="flex items-center gap-2">
                <UserCircle className="h-4 w-4 text-slate-400" />
                <span className="font-medium text-slate-900">{data.customer_details.name}</span>
              </div>
            )}
            {data.customer_details?.phone && (
              <div className="flex items-center gap-2">
                <WhatsAppIcon className="h-4 w-4 text-slate-400" />
                <span className="font-medium text-slate-900">{data.customer_details.phone}</span>
              </div>
            )}
            {data.customer_details?.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span className="font-medium text-slate-900 truncate">{data.customer_details.address}</span>
              </div>
            )}
            <div className="flex items-center gap-2 font-bold text-[#0F3F36] text-sm mt-2 border-t border-slate-50 pt-2">
              <DollarSign className="h-4 w-4" />
              <span>Total: ₹{data.pricing?.estimated_total_price}</span>
            </div>
          </div>

          <button
            className="w-full px-4 py-2.5 rounded-lg bg-[#0F3F36] text-white text-[13px] font-bold hover:opacity-90 transition-all shadow-sm"
            onClick={() => data.booking_id && sendMessage(`Track my order ${data.booking_id}`)}
          >
            Track Your Order
          </button>
        </div>
      );
    }

    // ── Missing Information ──
    if (data.booking_status === "missing_information" && data.missing_fields) {
      const allFields = ["name", "phone", "address", "cloth_type", "service"];
      const providedCount = allFields.length - (data.missing_fields.length || 0);
      const progress = (providedCount / allFields.length) * 100;

      return (
        <div className="mt-3 p-4 rounded-2xl bg-[#0F3F36]/5 border border-[#0F3F36]/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-[#0F3F36] animate-pulse" />
               <span className="text-[11px] font-black uppercase tracking-widest text-[#0F3F36]">Smart Booking Progress</span>
            </div>
            <span className="text-[10px] font-black text-[#0F3F36]">{Math.round(progress)}%</span>
          </div>
          
          <div className="h-2 w-full bg-[#0F3F36]/10 rounded-full overflow-hidden">
             <div 
               className="h-full bg-[#0F3F36] transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(15,63,54,0.3)]" 
               style={{ width: `${progress}%` }} 
             />
          </div>

          {data.missing_fields.length > 0 && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1.5 pt-1">
                {data.missing_fields.map((field) => {
                  const labels: Record<string, string> = {
                    name: "Name", phone: "Phone", address: "Location",
                    cloth_type: "Garment Type", service: "Service Mode",
                  };
                  return (
                    <Badge key={field} variant="outline" className="text-[9px] bg-white/50 border-emerald-100 text-[#0F3F36] font-bold uppercase px-2 py-0.5">
                      + Need {labels[field] || field}
                    </Badge>
                  );
                })}
              </div>

              <button
                className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#0F3F36]/20 text-[#0F3F36] text-[11px] font-bold hover:bg-[#0F3F36] hover:text-white transition-all flex items-center justify-center gap-2 group shadow-sm active:scale-[0.98]"
                onClick={() => {
                  const params = new URLSearchParams();
                  if (data.customer_details?.name) params.set("name", data.customer_details.name);
                  if (data.customer_details?.phone) params.set("phone", data.customer_details.phone);
                  if (data.customer_details?.address) params.set("address", data.customer_details.address);
                  if (data.service_recommendation?.recommended_service) params.set("service", data.service_recommendation.recommended_service);
                  window.location.href = `/booking?${params.toString()}`;
                }}
              >
                <Edit2 className="h-3.5 w-3.5" />
                Fill Form Manually
                <ArrowUpRight className="h-3 w-3 ml-auto opacity-40 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  const renderBookingAction = (data: StructuredResponse) => {
    // Don't show if already created
    if (data.booking_status === "created") return null;
    if (data.intent !== "create_booking" && data.intent !== "cloth_analysis") return null;
    // Show booking action if garments are detected
    if (data.intent === "cloth_analysis" && (!data.garments || data.garments.length === 0)) return null;

    const navigateToBooking = () => {
      const params = new URLSearchParams();
      if (data.customer_details?.name) params.set("name", data.customer_details.name);
      if (data.customer_details?.phone) params.set("phone", data.customer_details.phone);
      if (data.customer_details?.address) params.set("address", data.customer_details.address);
      if (data.service_recommendation?.recommended_service) params.set("service", data.service_recommendation.recommended_service);
      window.location.href = `/booking?${params.toString()}`;
    };

    return (
      <div className="mt-4 space-y-2.5">
        <button
          className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition-all hover:-translate-y-0.5 shadow-lg active:scale-[0.98]"
          onClick={() => sendMessage("I want to book a pickup for this")}
        >
          <Sparkles className="h-4 w-4 text-emerald-400" />
          Quick Book with AI
          <ArrowRight className="h-3 w-3 ml-auto opacity-40" />
        </button>

        <button
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-[11px] font-bold hover:bg-slate-50 transition-all active:scale-[0.98]"
          onClick={navigateToBooking}
        >
          <Edit2 className="h-3.5 w-3.5" />
          Fill Manually & Edit
          <ArrowUpRight className="h-3 w-3 ml-auto opacity-40" />
        </button>
      </div>
    );
  };

  const clearChat = () => {
    setMessages([
      {
        id: generateId(),
        role: "assistant",
        content: "Hi! I'm Sparky, your laundry pal. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
    setShowQuickActions(true);
  };

  const renderConfidenceScore = (score: number) => {
    // Hidden per user request - feels too technical for premium UI
    return null;
  };

  // ── Main Render ────────────────────────────────────────────
  return (
    <>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleImageUpload}
      />

      {/* Main UI Wrapper */}
      <div className="fixed inset-0 pointer-events-none z-[100]">
        
        {/* Chat window - Premium Mobile-First Redesign */}
        <div
          className={cn(
            "fixed transition-all duration-300 ease-in-out transform origin-bottom font-sans",
            "z-50 flex flex-col bg-white overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.15)]",
            // Desktop positioning
            "sm:bottom-10 sm:right-10 sm:w-[420px] sm:h-[700px] sm:max-h-[calc(100dvh-120px)] sm:rounded-[24px] sm:border sm:border-black/[0.05]",
            // Mobile positioning (Full screen - Fixed to viewport)
            "max-sm:fixed max-sm:inset-0 max-sm:w-full max-sm:h-[100dvh] max-sm:max-h-[100dvh] max-sm:rounded-none max-sm:z-[100]",
            isOpen
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-95 translate-y-8 pointer-events-none"
          )}
        >
          {/* Premium Header - Sticky by default in flex-col */}
          <div className="bg-[#008c5b] text-white h-[76px] px-6 flex items-center justify-between shrink-0 shadow-lg relative z-[110] border-b border-white/10">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-[16px] bg-gradient-to-br from-[#008c5b] to-[#00a86b] flex items-center justify-center border-2 border-white/40 overflow-hidden transition-all hover:scale-105 shadow-[0_4px_12px_rgba(0,140,91,0.3)]">
                <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-white drop-shadow-md">
                  <rect x="4" y="6" width="16" height="12" rx="3" className="fill-white/10 stroke-white" strokeWidth="1.5" />
                  <circle cx="9" cy="11" r="1.2" fill="white" />
                  <circle cx="15" cy="11" r="1.2" fill="white" />
                  <path d="M10 14.5C10.5 15.2 11.2 15.5 12 15.5C12.8 15.5 13.5 15.2 14 14.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                  <circle cx="12" cy="3" r="1.5" fill="white" />
                </svg>
              </div>
              <div className="flex flex-col">
                <h3 className="text-[17px] font-black tracking-tight text-white leading-tight">Sparky</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest whitespace-nowrap">Online</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              {/* Clear Chat Button */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded-full h-10 w-10 transition-all active:scale-90"
                onClick={clearChat}
                title="Clear Conversation"
              >
                <Trash2 className="h-5 w-5" />
              </Button>

              <div className="w-px h-6 bg-white/10 mx-0.5 max-sm:hidden" />

              <a 
                href={getWhatsAppHref("Hello, I need help with my laundry.")} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                title="Chat on WhatsApp"
              >
                <WhatsAppIcon className="w-5 h-5" />
              </a>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-10 w-10 transition-all active:scale-90 bg-white/5 max-sm:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Messages Area - Ensure this is the only scrollable part */}
          <div className="flex-1 overflow-hidden relative bg-white flex flex-col h-full">
            <ScrollArea className="h-full w-full flex-1">
              <div className="flex flex-col gap-4 p-5 pb-8">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-3 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                      msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                    )}
                  >
                    {/* Avatar - More subtle */}
                    <div
                      className={cn(
                        "w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0 shadow-[0_3px_12px_rgba(0,140,91,0.15)] overflow-hidden transition-all",
                        msg.role === "assistant"
                          ? "bg-gradient-to-br from-[#008c5b] to-[#00a86b] border-2 border-white"
                          : "bg-slate-100 text-slate-400 border-2 border-white"
                      )}
                    >
                      {msg.role === "assistant" ? (
                        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
                          <rect x="4" y="6" width="16" height="12" rx="3" className="fill-white/10 stroke-white" strokeWidth="1.5" />
                          <circle cx="9" cy="11" r="1" fill="white" />
                          <circle cx="15" cy="11" r="1" fill="white" />
                          <path d="M10 14.5C10.5 15.2 11.2 15.5 12 15.5C12.8 15.5 13.5 15.2 14 14.5" stroke="white" strokeWidth="1" strokeLinecap="round" />
                        </svg>
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div className="flex flex-col gap-1 min-w-0">
                      {/* Multi-image preview */}
                      {msg.images && msg.images.length > 0 && (
                        <div className={cn(
                          "flex gap-2 flex-wrap mb-1",
                          msg.images.length > 2 ? "grid grid-cols-2" : "flex"
                        )}>
                          {msg.images.map((imgUrl, imgIdx) => (
                            <div key={imgIdx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-black/[0.05] shadow-sm">
                              <Image src={imgUrl} alt={`Garment ${imgIdx + 1}`} fill className="object-cover" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Text bubble - Compact & Balanced */}
                      <div
                        className={cn(
                          "rounded-[20px] px-4 py-3 text-[14px] leading-[1.6] transition-all shadow-sm",
                          msg.role === "user"
                            ? "bg-[#008c5b] text-white rounded-tr-sm"
                            : "bg-white text-slate-700 border border-slate-100 rounded-tl-sm"
                        )}
                      >
                        {msg.content.split("\n").map((line, i) => (
                          <span key={i}>
                            {line.replace(/\*\*(.*?)\*\*/g, "$1")}
                            {i < msg.content.split("\n").length - 1 && <br />}
                          </span>
                        ))}
                      </div>

                      {/* Structured Data & Quick Actions */}
                      {msg.structuredData && (
                        <div className="space-y-1">
                          {renderIntentBadge(msg.structuredData.intent)}
                          {renderGarments(msg.structuredData)}
                          {renderServiceRecommendation(msg.structuredData)}
                          {renderPricing(msg.structuredData)}
                          {renderBookingStatus(msg.structuredData)}
                          {renderBookingAction(msg.structuredData)}
                          {renderConfidenceScore(msg.structuredData.confidence_score)}
                        </div>
                      )}

                      {/* Welcome Quick Actions */}
                      {messages.length === 1 && msg.id === messages[0].id && (
                        <div className="grid grid-cols-2 gap-2 mt-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                          {QUICK_ACTIONS.map((action, idx) => (
                            <button
                              key={idx}
                              onClick={() => sendMessage(action.message)}
                              className="flex flex-col items-start gap-2 p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-[#0F3F36]/20 hover:bg-[#0F3F36]/5 transition-all text-left group active:scale-[0.98]"
                            >
                              <div className="p-2 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-[#0F3F36]/10 transition-colors">
                                <action.icon className="h-4 w-4 text-slate-400 group-hover:text-[#0F3F36] transition-colors" />
                              </div>
                              <span className="text-[12px] font-bold text-slate-700 leading-tight">{action.label}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Timestamp */}
                      {mounted && (
                        <span suppressHydrationWarning className={cn("text-[10px] mt-1 px-1", msg.role === "user" ? "text-right text-slate-400" : "text-slate-400")}>
                          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isLoading && (
                  <div className="flex gap-3 max-w-[85%] animate-in fade-in duration-200">
                    <div className="w-9 h-9 rounded-[12px] bg-gradient-to-br from-[#008c5b] to-[#00a86b] flex items-center justify-center shrink-0 overflow-hidden shadow-md border-2 border-white">
                      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
                        <rect x="4" y="6" width="16" height="12" rx="3" className="fill-white/10 stroke-white" strokeWidth="1.5" />
                        <path d="M10 14.5C10.5 15.2 11.2 15.5 12 15.5C12.8 15.5 13.5 15.2 14 14.5" stroke="white" strokeWidth="1" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="bg-white text-slate-800 border border-slate-100 rounded-[20px] rounded-tl-sm px-4 py-3.5 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <span className="w-2 h-2 bg-[#008c5b]/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 bg-[#008c5b]/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 bg-[#008c5b]/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={scrollRef} />
              </div>
            </ScrollArea>
          </div>

          {/* Compose Area - Fixed & Clean */}
          <div className="px-4 pt-3 pb-6 sm:pb-5 bg-white border-t border-black/[0.03] shrink-0 relative z-10">
            <div className={cn(
              "flex flex-col bg-slate-50/80 backdrop-blur-sm rounded-[24px] border border-black/[0.03] overflow-hidden transition-all duration-300",
              pendingImages.length > 0 ? "pt-2" : ""
            )}>
              {/* Image Previews */}
              {pendingImages.length > 0 && (
                <div className="px-3 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
                  {pendingImages.map((img, idx) => (
                    <div key={idx} className="relative shrink-0">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-black/[0.05] bg-white">
                        <Image src={img.url} alt={img.name} fill className="object-cover" />
                      </div>
                      <button
                        onClick={() => removePendingImage(idx)}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-white border border-black/[0.1] text-black rounded-full flex items-center justify-center shadow-sm"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Text Input Row */}
              <form onSubmit={handleSubmit} className="flex items-center h-[52px] pr-1.5 pl-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-slate-400 hover:text-[#0F3F36] transition-colors shrink-0"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  <Camera className="h-5 w-5" />
                </Button>
                <Input
                  ref={inputRef}
                  placeholder="Ask about laundry..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 !border-none !ring-0 !ring-offset-0 bg-transparent text-[14px] h-full shadow-none px-1"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={(!input.trim() && pendingImages.length === 0) || isLoading}
                  className="h-9 w-9 rounded-full bg-[#0F3F36] hover:bg-[#1a5a4e] text-white shadow-sm shrink-0 transition-all active:scale-90 disabled:opacity-30 disabled:grayscale"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
            
            {pendingImages.length > 0 && (
              <div className="flex justify-center mt-3">
                <button
                  onClick={clearAllPendingImages}
                  className="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                >
                  Discard Images
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Futuristic Floating Action Button */}
        <FuturisticFab 
          onClick={() => setIsOpen(true)} 
          isOpen={isOpen} 
        />

      </div>
    </>
  );
}
