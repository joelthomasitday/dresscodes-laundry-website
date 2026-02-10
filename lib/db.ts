import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// Global cache for MongoDB connection (avoids reconnecting on every API call in dev)
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };
if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Connect to MongoDB. Returns cached connection if already connected.
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/dresscode";

  if (!process.env.MONGODB_URI && process.env.NODE_ENV === "production") {
    console.error("❌ CRITICAL: MONGODB_URI environment variable is missing!");
  } else {
    // Log masked URI for debugging (safe to log)
    const maskedUri = (process.env.MONGODB_URI || "mongodb://local").replace(/:([^@]+)@/, ":****@");
    console.log(`🔌 Attempting MongoDB connection to: ${maskedUri}`);
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      w: "majority",
    }).then((mongoose) => {
        console.log("✅ MongoDB Connected!");
        return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ MongoDB connection error:", e);
    throw e;
  }

  return cached.conn;
}
