import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { createToken, setAuthCookie } from "@/lib/auth";
 
 export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Ensure connection is established
    if (mongoose.connection.readyState !== 1) {
      console.error("Database connection failed or not established.");
      return NextResponse.json(
        { error: "Database connection unavailable in production environment" },
        { status: 503 }
      );
    }

    console.log(`🔍 Looking for user: ${email}`);
    let user = await User.findOne({ email: email.toLowerCase(), isActive: true });
    
    // AUTO-HEALING: If admin user is missing, but they are trying to login with default credentials, create it.
    if (!user && email === "admin@dresscodes.in" && password === "admin123") {
        console.log("⚠️ Admin user not found, but default credentials provided. Auto-creating admin...");
        try {
            const hashedPassword = await bcrypt.hash("admin123", 12);
            user = await User.create({
                name: "Admin",
                email: "admin@dresscodes.in",
                phone: "8943437272",
                passwordHash: hashedPassword,
                role: "admin",
                isActive: true
            });
            console.log("✅ Admin user auto-created successfully.");
        } catch (createError) {
            console.error("❌ Failed to auto-create admin:", createError);
            // Fall through to normal failure
        }
    }

    if (!user) {
      console.log("❌ User not found in DB");
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }
    console.log("✅ User found:", user._id);

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    console.log("Password match result:", isMatch);
    if (!isMatch) {
      console.log("Password mismatch");
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create JWT token
    console.log("Creating token...");
    try {
      const token = await createToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
      });
      console.log("Token created successfully");

      // Set HttpOnly cookie
      console.log("Setting cookie...");
      await setAuthCookie(token);
      console.log("Cookie set successfully");
    } catch (tokenError: any) {
      console.error("Token/Cookie error:", tokenError);
      return NextResponse.json(
        { error: "Token generation failed", details: tokenError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Login fatal error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined 
      },
      { status: 500 }
    );
  }
}
