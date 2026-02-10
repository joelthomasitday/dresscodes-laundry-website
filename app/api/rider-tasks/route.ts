import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { RiderTask } from "@/models/RiderTask";
import { getCurrentUser } from "@/lib/auth";

/**
 * GET /api/rider-tasks — List rider tasks
 * Riders see only their own tasks. Admins see all.
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const filter: any = {};
    if (user.role === "rider") {
      filter.riderId = user.userId;
    }
    if (status && status !== "all") {
      filter.status = status;
    }

    const tasks = await RiderTask.find(filter).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ tasks });
  } catch (error: any) {
    console.error("GET /api/rider-tasks error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/rider-tasks — Create a new rider task (admin only)
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { riderId, orderId, orderNumber, type, customer, scheduledTime } = body;

    if (!riderId || !orderId || !type || !customer) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const task = await RiderTask.create({
      riderId,
      orderId,
      orderNumber,
      type,
      customer,
      scheduledTime: scheduledTime ? new Date(scheduledTime) : undefined,
    });

    return NextResponse.json({ success: true, task }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/rider-tasks error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
