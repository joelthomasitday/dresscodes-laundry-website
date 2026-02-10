import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { getCurrentUser } from "@/lib/auth";
import { ORDER_STATUSES } from "@/lib/constants";

/**
 * GET /api/dashboard — Dashboard stats for admin
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get counts by status
    const statusCounts: Record<string, number> = {};
    for (const status of ORDER_STATUSES) {
      statusCounts[status] = await Order.countDocuments({ status });
    }

    // Total orders
    const totalOrders = await Order.countDocuments();

    // Total revenue (from delivered orders)
    const revenueResult = await Order.aggregate([
      { $match: { status: "DELIVERED" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today },
    });

    // Pending orders (not delivered)
    const pendingOrders = await Order.countDocuments({
      status: { $ne: "DELIVERED" },
    });

    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("orderNumber customer.name status totalAmount createdAt")
      .lean();

    return NextResponse.json({
      stats: {
        totalOrders,
        totalRevenue,
        todayOrders,
        pendingOrders,
      },
      statusCounts,
      recentOrders,
    });
  } catch (error: any) {
    console.error("GET /api/dashboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
