import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { Notification } from "@/models/Notification";
import { getCurrentUser } from "@/lib/auth";

/**
 * GET /api/orders — List orders (admin/staff: all, rider: assigned)
 * Query params: status, page, limit, search
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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search");
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {};
    if (status && status !== "all") filter.status = status;
    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { orderNumber: { $regex: escapedSearch, $options: "i" } },
        { "customer.name": { $regex: escapedSearch, $options: "i" } },
        { "customer.phone": { $regex: escapedSearch, $options: "i" } },
      ];
    }

    // Restrict access based on role
    if (user.role === "rider") {
      // Riders should generally use /api/rider-tasks, but if they use this, 
      // they should only see orders where they are assigned.
      filter.assignedRider = user.userId;
    } else if (user.role === "staff") {
      // Staff only sees assigned orders
      filter.assignedStaff = user.userId;
    }
    // Admin sees all (no extra filter)

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(filter),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/orders — Create a new order (guest booking — no auth required)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, services, pickupDate, pickupTimeSlot, notes } = body;

    // Validation
    if (!customer?.name || !customer?.phone || !customer?.address) {
      return NextResponse.json(
        { error: "Customer name, phone, and address are required" },
        { status: 400 }
      );
    }
    if (!pickupDate || !pickupTimeSlot) {
      return NextResponse.json(
        { error: "Pickup date and time slot are required" },
        { status: 400 }
      );
    }
    if (!services || services.length === 0) {
      return NextResponse.json(
        { error: "At least one service is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Calculate total
    const totalAmount = services.reduce(
      (sum: number, s: any) => sum + (s.price || 0) * (s.quantity || 1),
      0
    );

    const order = await Order.create({
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        email: customer.email?.trim(),
        address: customer.address.trim(),
      },
      services: services.map((s: any) => ({
        serviceId: s.serviceId,
        name: s.name,
        quantity: Math.max(1, s.quantity || 1),
        price: Math.max(0, s.price || 0),
      })),
      pickupDate: new Date(pickupDate),
      pickupTimeSlot,
      notes: notes?.substring(0, 500),
      totalAmount,
      status: "CREATED",
      statusHistory: [
        {
          status: "CREATED",
          timestamp: new Date(),
          note: "Order created via website",
        },
      ],
    });

    // Create in-app notification for admin
    try {
      await Notification.create({
        type: "NEW_ORDER",
        title: "New Order Received",
        message: `Order #${order.orderNumber} has been placed by ${order.customer.name}`,
        orderId: order._id,
        channel: "in_app",
      });
    } catch (notifErr) {
      console.error("Failed to create notification:", notifErr);
    }

    return NextResponse.json(
      { success: true, order: { orderNumber: order.orderNumber, id: order._id } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { error: "Failed to create order. Please check your details." },
      { status: 500 }
    );
  }
}
