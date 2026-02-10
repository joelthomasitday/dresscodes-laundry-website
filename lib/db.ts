import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectDB(): Promise<typeof mongoose> {
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (mongoose.connection.readyState === 2) {
    // Already connecting, wait for it
    console.log("⏳ MongoDB is connecting...");
    // We can just return the promise of connect? 
    // Actually, if we just call connect again, Mongoose handles buffering.
  }

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing in environment variables.");
  }

  try {
    console.log("🔌 Connecting to MongoDB (fresh connection)...");
    const conn = await mongoose.connect(MONGODB_URI, {
      bufferCommands: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      w: "majority",
    });
    console.log("✅ MongoDB Connected!");
    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}
