import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

/**
 * GET /api/riders — List all users with role 'rider' (admin only)
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const riders = await User.find({ role: "rider" })
      .select("_id name email")
      .lean();

    return NextResponse.json({ riders });
  } catch (error: any) {
    console.error("GET /api/riders error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
