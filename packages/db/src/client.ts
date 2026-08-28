import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  // Allow build without env; runtime will throw if missing
  console.warn("[db] MONGODB_URI not set — db operations will fail at runtime");
}

// Global cache for serverless / HMR
declare global {
  // eslint-disable-next-line no-var
  var _mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

const cached = global._mongoose ?? { conn: null, promise: null };
if (!global._mongoose) global._mongoose = cached;

export async function connectDB() {
  if (!MONGODB_URI) throw new Error("MONGODB_URI is required");

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }

  try {
    cached.conn = await cached.promise;
    console.log("[db] connected");
  } catch (e) {
    cached.promise = null;
    console.error("[db] connect failed", e);
    throw e;
  }
  return cached.conn;
}

export { mongoose };
