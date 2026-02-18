import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { ORDER_STATUS_LABELS } from "@/lib/constants";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

// ── Pricing lookup table ──────────────────────────────────────
const PRICING: Record<string, number> = {
  normal_wash: 140, // per kg default, per piece ₹30
  dry_clean: 150,
  stain_treatment: 100,
  steam_iron: 40,
  shoe_cleaning: 200,
  mixed: 140, // default to normal wash rate for mixed
};

// ── System Prompt with multi-garment schema ───────────────────
const SYSTEM_PROMPT = `You are Sparky, a friendly "Laundry Pal" for DressCodes. You are helpful, cute, and professional.
You analyze garment images and help users with bookings, price estimates, and order tracking.

STRICT PERSONALITY RULES:
1. Refer to yourself as Sparky.
2. Be concise but friendly.
3. Always respond with valid JSON. Never return plain text.

PRICING & SERVICES (Kottayam):
- Wash & Iron (per kg/piece): ₹140 / ₹30
- Ironing Only: ₹20 | Steam Iron: ₹40
- Dry Cleaning: starts ₹150
- Express Service: +50% surcharge (delivered within 24h)
- Shoe Cleaning: ₹200/pair

HOW IT WORKS (4 STEPS):
1. Schedule Pickup: Book online or via chat.
2. We Collect: Our team collects your garments.
3. Professional Care: Expert cleaning at our facility.
4. Fresh Delivery: Delivered back to your doorstep.

RESPONSE JSON SCHEMA:
{
  "intent": "cloth_analysis | price_estimate | create_booking | track_order | faq | general_chat",
  "garments": [
    {
      "cloth_type": "string_or_null",
      "category": "casual | formal | ethnic | home_fabric | unknown | null",
      "fabric_type": "string_or_unknown",
      "stain_detected": boolean_or_null,
      "stain_type": "string_or_none",
      "complexity_level": "low | medium | high | null"
    }
  ],
  "total_quantity_estimate": number_or_null,
  "service_recommendation": {
    "recommended_service": "normal_wash | dry_clean | stain_treatment | steam_iron | mixed | null",
    "express_recommended": boolean_or_null,
    "pickup_date": "string_or_null",
    "pickup_time": "string_or_null"
  },
  "pricing": { "estimated_total_price": number_or_null },
  "customer_details": {
    "name": "string_or_null",
    "phone": "string_or_null",
    "address": "string_or_null"
  },
  "booking_status": "ready_to_create | missing_information | null",
  "missing_fields": [],
  "response_message": "friendly_sparky_style_text",
  "confidence_score": number_between_0_and_1
}

Never include markdown or text outside JSON.`;

// ── TypeScript Interfaces ─────────────────────────────────────
interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
}

interface GarmentDetail {
  cloth_type: string | null;
  category: string | null;
  fabric_type: string;
  stain_detected: boolean | null;
  stain_type: string;
  complexity_level: string | null;
}

interface AIStructuredResponse {
  intent: string;
  garments: GarmentDetail[];
  total_quantity_estimate: number | null;
  service_recommendation: {
    recommended_service: string | null;
    express_recommended: boolean | null;
    pickup_date?: string | null;
    pickup_time?: string | null;
  };
  pricing: {
    estimated_total_price: number | null;
  };
  customer_details: {
    name: string | null;
    phone: string | null;
    address: string | null;
  };
  booking_status: string | null;
  missing_fields: string[];
  response_message: string;
  confidence_score: number;
}

// ── Helper: calculate price from garments data ────────────────
function calculatePrice(
  service: string | null | undefined,
  quantity: number,
  hasStains: boolean,
  expressRecommended: boolean
): { base_price: number; stain_charge: number; express_fee: number; estimated_total_price: number } {
  const baseRate = service ? (PRICING[service] || 140) : 140;
  const base_price = baseRate * quantity;
  const stain_charge = hasStains ? 75 * quantity : 0;
  const subtotal = base_price + stain_charge;
  const express_fee = expressRecommended ? Math.round(subtotal * 0.5) : 0;
  const estimated_total_price = subtotal + express_fee;

  return { base_price, stain_charge, express_fee, estimated_total_price };
}

// ── Helper: validate required booking fields ──────────────────
function getActualMissingFields(data: AIStructuredResponse): string[] {
  const missing: string[] = [];
  if (!data.customer_details?.name) missing.push("name");
  if (!data.customer_details?.phone) missing.push("phone");
  if (!data.customer_details?.address) missing.push("address");

  // Check if at least one garment with a cloth_type is present
  const hasValidGarment = data.garments?.some(
    (g) => g.cloth_type && g.cloth_type !== "null" && g.cloth_type !== "unknown"
  );
  if (!hasValidGarment) {
    missing.push("cloth_type");
  }

  if (!data.service_recommendation?.recommended_service) missing.push("service");
  return missing;
}

// ── Helper: build user-friendly missing fields message ────────
function buildMissingFieldsMessage(missingFields: string[]): string {
  const fieldNames: Record<string, string> = {
    name: "your name",
    phone: "your phone number",
    address: "your pickup address",
    cloth_type: "the type of garment (or send a photo)",
    service: "the service you'd like",
  };
  const readableFields = missingFields.map((f) => fieldNames[f] || f);

  if (readableFields.length === 1) {
    return `Almost there! I just need ${readableFields[0]} to confirm your booking.`;
  }
  const last = readableFields.pop();
  return `To complete your booking, I need: ${readableFields.join(", ")} and ${last}.`;
}

// ── Default fallback response ─────────────────────────────────
function defaultResponse(message?: string): AIStructuredResponse {
  return {
    intent: "general_chat",
    garments: [],
    total_quantity_estimate: null,
    service_recommendation: { recommended_service: null, express_recommended: null },
    pricing: { estimated_total_price: null },
    customer_details: { name: null, phone: null, address: null },
    booking_status: null,
    missing_fields: [],
    response_message: message || "I'm here to help with your laundry needs!",
    confidence_score: 0.5,
  };
}

// ══════════════════════════════════════════════════════════════
// ██  MAIN POST HANDLER                                      ██
// ══════════════════════════════════════════════════════════════
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    // ── 1. Build message history for OpenRouter ────────────────
    const apiMessages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    const recentMessages = messages.slice(-12);

    for (const msg of recentMessages) {
      if (msg.role === "assistant" && msg.structuredData) {
        apiMessages.push({
          role: "assistant",
          content: JSON.stringify(msg.structuredData),
        });
      } else if (msg.role === "user") {
        // Support multiple images in a single message
        if (msg.images && Array.isArray(msg.images) && msg.images.length > 0) {
          const contentParts: Array<{ type: string; text?: string; image_url?: { url: string } }> = [
            {
              type: "text",
              text: msg.content || "Please analyze these garment images. Detect the cloth type, fabric, any stains, and recommend appropriate services for each.",
            },
          ];
          for (const imgUrl of msg.images) {
            contentParts.push({
              type: "image_url",
              image_url: { url: imgUrl },
            });
          }
          apiMessages.push({ role: "user", content: contentParts });
        } else if (msg.image) {
          // Backward compatibility: single image field
          apiMessages.push({
            role: "user",
            content: [
              {
                type: "text",
                text: msg.content || "Please analyze this garment image. Detect the cloth type, fabric, any stains, and recommend the best service.",
              },
              {
                type: "image_url",
                image_url: { url: msg.image },
              },
            ],
          });
        } else {
          apiMessages.push({
            role: "user",
            content: msg.content,
          });
        }
      }
    }

    // ── 2. Call OpenRouter AI ──────────────────────────────────
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://dresscodes.in",
        "X-Title": "DressCodes AI Assistant",
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-nano-12b-v2-vl:free",
        messages: apiMessages,
        temperature: 0.2,
        max_tokens: 1500,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", response.status, errorText);
      const fallback = defaultResponse(
        "I'm having a bit of trouble analyzing this image right now. Could you please check the quality or try again? You can also reach us on WhatsApp!"
      );
      fallback.confidence_score = 0;
      return NextResponse.json(fallback);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || "";

    // ── 3. Parse AI JSON response ─────────────────────────────
    let parsed: AIStructuredResponse;
    try {
      const jsonStart = rawContent.indexOf("{");
      const jsonEnd = rawContent.lastIndexOf("}");
      if (jsonStart === -1 || jsonEnd === -1) throw new Error("No JSON found");

      const jsonStr = rawContent.substring(jsonStart, jsonEnd + 1);
      const rawParsed = JSON.parse(jsonStr);

      // Normalize garments array — handle both old cloth_details and new garments format
      let garments: GarmentDetail[] = [];
      if (Array.isArray(rawParsed.garments) && rawParsed.garments.length > 0) {
        garments = rawParsed.garments.map((g: Record<string, unknown>) => ({
          cloth_type: (g.cloth_type as string) || null,
          category: (g.category as string) || "unknown",
          fabric_type: (g.fabric_type as string) || "unknown",
          stain_detected: g.stain_detected ?? null,
          stain_type: (g.stain_type as string) || "none",
          complexity_level: (g.complexity_level as string) || null,
        }));
      } else if (rawParsed.cloth_details) {
        // Backward compatibility: convert old single cloth_details to garments array
        const cd = rawParsed.cloth_details;
        garments = [{
          cloth_type: cd.cloth_type || null,
          category: cd.category || "unknown",
          fabric_type: cd.fabric_type || "unknown",
          stain_detected: cd.stain_detected ?? null,
          stain_type: cd.stain_type || "none",
          complexity_level: cd.complexity_level || null,
        }];
      }

      // Normalize with defaults
      parsed = {
        intent: rawParsed.intent || "general_chat",
        garments,
        total_quantity_estimate: rawParsed.total_quantity_estimate ?? (garments.length > 0 ? garments.length : null),
        service_recommendation: {
          recommended_service: rawParsed.service_recommendation?.recommended_service || null,
          express_recommended: rawParsed.service_recommendation?.express_recommended ?? null,
        },
        pricing: {
          estimated_total_price: rawParsed.pricing?.estimated_total_price
            ?? rawParsed.pricing?.total_estimated_price
            ?? null,
        },
        customer_details: {
          name: rawParsed.customer_details?.name || null,
          phone: rawParsed.customer_details?.phone || null,
          address: rawParsed.customer_details?.address || null,
        },
        booking_status: rawParsed.booking_status || null,
        missing_fields: rawParsed.missing_fields || [],
        response_message: rawParsed.response_message || "I'm here to help with your laundry needs!",
        confidence_score: rawParsed.confidence_score ?? 0.5,
      };
    } catch (parseError) {
      console.error("Failed to parse AI response:", rawContent);
      const fallback = defaultResponse(
        rawContent || "I processed your request but had trouble formatting the response. Could you try rephrasing?"
      );
      fallback.confidence_score = 0.3;
      return NextResponse.json(fallback);
    }

    // ══════════════════════════════════════════════════════════
    // ██  LAYER 2: BACKEND BOOKING LOGIC                     ██
    // ══════════════════════════════════════════════════════════
    if (parsed.intent === "create_booking") {
      // Server-side re-validation of missing fields
      const actualMissing = getActualMissingFields(parsed);

      if (actualMissing.length > 0) {
        // Fields are still missing — ask user
        parsed.booking_status = "missing_information";
        parsed.missing_fields = actualMissing;
        parsed.response_message = buildMissingFieldsMessage(actualMissing);
        return NextResponse.json(parsed);
      }

      // All fields present — calculate price server-side
      const quantity = parsed.total_quantity_estimate ?? (parsed.garments.length || 1);
      const service = parsed.service_recommendation?.recommended_service ?? null;
      const hasStains = parsed.garments.some((g) => g.stain_detected === true);
      const express = parsed.service_recommendation?.express_recommended ?? false;

      const serverPrice = calculatePrice(service, quantity, hasStains, express);
      parsed.pricing = {
        estimated_total_price: serverPrice.estimated_total_price,
      };

      // ── INSERT INTO MONGODB ─────────────────────────────────
      try {
        await connectDB();

        const pickupDate = parsed.service_recommendation?.pickup_date 
          ? new Date(parsed.service_recommendation.pickup_date)
          : new Date();
        
        if (!parsed.service_recommendation?.pickup_date) {
          pickupDate.setDate(pickupDate.getDate() + 1); // default: next day
        }

        const pickupTimeSlot = parsed.service_recommendation?.pickup_time || "10:00 AM - 12:00 PM";

        // Build services array from garments
        const orderServices = parsed.garments
          .filter((g) => g.cloth_type)
          .map((g) => {
            const svc = service
              ? service.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
              : "Normal Wash";
            return {
              name: `${svc} — ${g.cloth_type}`,
              quantity: 1,
              price: Math.round(serverPrice.estimated_total_price / (parsed.garments.length || 1)),
            };
          });

        // Fallback if no garment-based services
        if (orderServices.length === 0) {
          const serviceName = service
            ? service.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
            : "Normal Wash";
          orderServices.push({
            name: serviceName,
            quantity: quantity,
            price: serverPrice.estimated_total_price,
          });
        }

        const garmentNotes = parsed.garments
          .map((g, i) => {
            const stainInfo = g.stain_detected ? `Stain: ${g.stain_type}` : "No stains";
            return `[${i + 1}] ${g.cloth_type || "Unknown"} (${g.fabric_type || "unknown"}) — ${stainInfo}`;
          })
          .join(" | ");

        const newOrder = new Order({
          customer: {
            name: parsed.customer_details!.name!,
            phone: parsed.customer_details!.phone!,
            address: parsed.customer_details!.address!,
          },
          services: orderServices,
          status: "CREATED",
          pickupDate: pickupDate,
          pickupTimeSlot: pickupTimeSlot,
          totalAmount: serverPrice.estimated_total_price,
          notes: `AI Booking | ${garmentNotes}`,
          statusHistory: [
            {
              status: "CREATED",
              timestamp: new Date(),
              note: "Booking created via AI chatbot",
            },
          ],
        });

        const savedOrder = await newOrder.save();

        console.log("✅ AI Booking created:", savedOrder.orderNumber);

        // Build garment summary text
        const garmentSummary = parsed.garments
          .filter((g) => g.cloth_type)
          .map((g) => g.cloth_type)
          .join(", ");

        // Return success
        parsed.booking_status = "created";
        parsed.missing_fields = [];
        parsed.response_message = `🎉 Your booking has been created successfully!\n\n📋 Booking ID: ${savedOrder.orderNumber}\n👤 Name: ${parsed.customer_details!.name}\n📍 Address: ${parsed.customer_details!.address}\n👔 Garments: ${garmentSummary || "As described"}\n💰 Total: ₹${serverPrice.estimated_total_price}\n📅 Pickup: ${pickupDate.toLocaleDateString("en-IN")}\n⏰ Time: ${pickupTimeSlot}\n\nWe'll send a rider for pickup. You can track your order anytime!`;

        return NextResponse.json({
          ...parsed,
          booking_id: savedOrder.orderNumber,
        });
      } catch (dbError) {
        console.error("❌ Failed to create booking in DB:", dbError);
        parsed.booking_status = "missing_information";
        parsed.response_message =
          "I gathered all your details but had trouble saving the booking. Please try again or contact us on WhatsApp for immediate assistance!";
        return NextResponse.json(parsed);
      }
    } else if (parsed.intent === "track_order") {
      try {
        await connectDB();
        
        // Try to find the order ID in the last few messages or response_message
        const lastUserMessage = messages.filter((m: any) => m.role === "user").pop()?.content || "";
        const idMatch = String(lastUserMessage).match(/DC-\d+/i) || parsed.response_message.match(/DC-\d+/i);
        
        if (idMatch) {
          const orderId = idMatch[0].toUpperCase();
          const order = await Order.findOne({ orderNumber: orderId });
          
          if (order) {
            const currentStatus = ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] || order.status;
            const history = order.statusHistory
              ? order.statusHistory
                  .map((h: any) => `- ${new Date(h.timestamp).toLocaleDateString("en-IN")}: ${ORDER_STATUS_LABELS[h.status as keyof typeof ORDER_STATUS_LABELS] || h.status}${h.note ? ` (${h.note})` : ""}`)
                  .join("\n")
              : "No history available";

            parsed.response_message = `📦 **Order Status for ${orderId}:**\n\nYour order is currently **${currentStatus}**.\n\n**Timeline:**\n${history}\n\nNeed more help? Just ask!`;
            
            return NextResponse.json({
              ...parsed,
              order_details: {
                id: order.orderNumber,
                status: order.status,
                customer: order.customer.name,
              }
            });
          } else {
            parsed.response_message = `I couldn't find an order with ID **${orderId}**. Please double-check the number and try again!`;
          }
        }
      } catch (dbError) {
        console.error("❌ Order tracking DB error:", dbError);
      }
    }

    // ── Non-booking intents: return AI response as-is ─────────
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Super Chat API error:", error);
    return NextResponse.json(
      defaultResponse("I encountered an unexpected issue while processing your request. Please try again or reach out on WhatsApp!")
    );
  }
}
