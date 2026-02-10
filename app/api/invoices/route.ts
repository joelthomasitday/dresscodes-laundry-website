import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Invoice } from "@/models/Invoice";
import { getCurrentUser } from "@/lib/auth";

/**
 * GET /api/invoices — List invoices (admin only)
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const [invoices, total] = await Promise.all([
      Invoice.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Invoice.countDocuments(),
    ]);

    return NextResponse.json({
      invoices,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    console.error("GET /api/invoices error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/invoices — Create a new invoice (admin only)
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { customer, items, subtotal, tax, discount, total, orderId } = body;

    if (!customer?.name || !customer?.phone || !items?.length) {
      return NextResponse.json(
        { error: "Customer info and items are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const invoice = await Invoice.create({
      customer,
      items,
      subtotal,
      tax: tax || 0,
      discount: discount || 0,
      total,
      orderId,
    });

    return NextResponse.json({ success: true, invoice }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/invoices error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" }, 
      { status: 500 }
    );
  }
}
