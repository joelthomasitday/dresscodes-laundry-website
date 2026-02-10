import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";

/**
 * GET /api/orders/track/[orderNumber]
 * Public endpoint — allows customers to track their order by order number.
 * No authentication required.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;

    if (!orderNumber) {
      return NextResponse.json(
        { error: "Order number is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const order = await Order.findOne({
      orderNumber: orderNumber.toUpperCase(),
    })
      .select(
        "orderNumber customer.name status pickupDate deliveryDate statusHistory totalAmount services createdAt"
      )
      .lean();

    if (!order) {
      return NextResponse.json(
        { error: "Order not found. Please check the order number." },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error("Track order error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
