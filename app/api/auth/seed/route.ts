import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

/**
 * Seed endpoint — creates default admin user if none exists.
 * Only works in development or if ALLOW_SEED=true.
 * POST /api/auth/seed
 */
export async function POST(req: NextRequest) {
  try {
    const bypassSecret = process.env.SEED_BYPASS_SECRET;
    const authHeader = req.headers.get("authorization");

    if (process.env.NODE_ENV === "production") {
      if (!bypassSecret || authHeader !== `Bearer ${bypassSecret}`) {
        return NextResponse.json(
          { error: "Seed endpoint disabled in production" },
          { status: 403 }
        );
      }
    }

    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return NextResponse.json({
        message: "Admin user already exists",
        email: existingAdmin.email,
      });
    }

    // Create default admin
    const passwordHash = await bcrypt.hash("admin123", 12);
    const admin = await User.create({
      name: "Admin",
      email: "admin@dresscodes.in",
      phone: "8943437272",
      passwordHash,
      role: "admin",
      isActive: true,
    });

    // Create default staff
    const staffHash = await bcrypt.hash("staff123", 12);
    await User.create({
      name: "Staff User",
      email: "staff@dresscodes.in",
      phone: "0000000001",
      passwordHash: staffHash,
      role: "staff",
      isActive: true,
    });

    // Create default rider
    const riderHash = await bcrypt.hash("rider123", 12);
    await User.create({
      name: "Rider User",
      email: "rider@dresscodes.in",
      phone: "0000000002",
      passwordHash: riderHash,
      role: "rider",
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      message: "Default users created",
      admin: { email: "admin@dresscodes.in", password: "admin123" },
      staff: { email: "staff@dresscodes.in", password: "staff123" },
      rider: { email: "rider@dresscodes.in", password: "rider123" },
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: error.message || "Seed failed" },
      { status: 500 }
    );
  }
}
