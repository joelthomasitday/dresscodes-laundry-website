import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("secret") !== "dresscode_debug") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const uriDefined = !!process.env.MONGODB_URI;
    
    // Attempt connection
    let connectionStatus = "Not connected";
    try {
      await connectDB();
      connectionStatus = "Connected";
    } catch (e: any) {
      connectionStatus = `Connection failed: ${e.message}`;
    }

    // Count users
    let userCount = 0;
    let adminExists = false;
    
    if (connectionStatus === "Connected") {
      try {
        userCount = await User.countDocuments();
        const admin = await User.findOne({ email: "admin@dresscodes.in" });
        adminExists = !!admin;
      } catch (e: any) {
        return NextResponse.json({
          error: "Database query failed",
          details: e.message,
          connectionStatus
        });
      }
    }

    return NextResponse.json({
      env: {
        MONGODB_URI_DEFINED: uriDefined,
        NODE_ENV: process.env.NODE_ENV
      },
      db: {
        connectionStatus,
        userCount,
        adminExists
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      error: "General error",
      message: error.message
    }, { status: 500 });
  }
}
