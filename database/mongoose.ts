import mongoose from "mongoose";
import {logger} from "@/lib/logger";

declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export const connectToCluster = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MongoDB URI is missing");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;

    logger.info("MongoDB Connected");
  } catch (err) {
    logger.error(err);
    cached.promise = null;
    throw err;
  }
};
