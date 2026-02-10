import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Service } from "@/models/Service";
import { getCurrentUser } from "@/lib/auth";

/**
 * GET /api/services — List all active services (public)
 */
export async function GET() {
  try {
    await connectDB();
    const services = await Service.find({ isActive: true }).sort({ category: 1, name: 1 }).lean();
    return NextResponse.json({ services });
  } catch (error: any) {
    console.error("GET /api/services error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/services — Create a new service (admin only)
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, category, price, unit } = body;

    if (!name || !category || price === undefined) {
      return NextResponse.json(
        { error: "Name, category, and price are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const service = await Service.create({
      name,
      description,
      category,
      price,
      unit: unit || "piece",
    });

    return NextResponse.json({ success: true, service }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/services error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
