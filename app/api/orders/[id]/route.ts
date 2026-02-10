import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { Invoice } from "@/models/Invoice";
import { getCurrentUser } from "@/lib/auth";

/**
 * GET /api/orders/[id] — Get a single order by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const order = await Order.findById(id).lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Authorization: Riders and Staff only see their assigned orders
    if (user.role === "rider" && order.assignedRider?.toString() !== user.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (user.role === "staff" && order.assignedStaff?.toString() !== user.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error("GET /api/orders/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PATCH /api/orders/[id] — Update order (status, assignment, etc.)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Role-based authorization for updates
    if (user.role === "rider" && order.assignedRider?.toString() !== user.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (user.role === "staff" && order.assignedStaff?.toString() !== user.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update status with history tracking
    if (body.status) {
      order.status = body.status;
      order.statusHistory.push({
        status: body.status,
        timestamp: new Date(),
        updatedBy: user.name,
        note: body.statusNote || `Status updated to ${body.status}`,
      });

      if (body.status === "DELIVERED") {
        try {
          const existingInvoice = await Invoice.findOne({ orderId: order._id });
          if (!existingInvoice) {
            const items = order.services.map((s: any) => ({
              name: s.name,
              qty: s.quantity,
              price: s.price,
              total: s.quantity * s.price,
            }));
            const subtotal = items.reduce((sum: number, item: any) => sum + item.total, 0);

            await Invoice.create({
              orderId: order._id,
              customer: order.customer,
              items,
              subtotal,
              tax: 0,
              discount: 0,
              total: order.totalAmount,
              status: "sent",
            });
            console.log("Auto-generated invoice for order:", order.orderNumber);
          }
        } catch (invError) {
          console.error("Failed to auto-generate invoice:", invError);
        }
      }
    }

    // Update other fields
    if (body.assignedStaff !== undefined) order.assignedStaff = body.assignedStaff;
    if (body.assignedRider !== undefined) order.assignedRider = body.assignedRider;
    if (body.deliveryDate) order.deliveryDate = new Date(body.deliveryDate);
    if (body.notes !== undefined) order.notes = body.notes;
    if (body.totalAmount !== undefined) order.totalAmount = body.totalAmount;

    await order.save();

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("PATCH /api/orders/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
