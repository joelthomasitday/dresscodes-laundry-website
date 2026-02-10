import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("MONGODB_URI is not defined in production environment");
  }
  process.env.MONGODB_URI = "mongodb://localhost:27017/dresscode";
}

const FINAL_MONGODB_URI = MONGODB_URI || "mongodb://localhost:27017/dresscode";

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
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(FINAL_MONGODB_URI, {
      bufferCommands: true,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
