import mongoose from "mongoose";

let connectionPromise: Promise<typeof mongoose> | null = null;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!connectionPromise) {
    const mongodbUri = process.env.MONGODB_URI;

    if (!mongodbUri) {
      throw new Error("MONGODB_URI environment variable is required");
    }

    connectionPromise = mongoose.connect(mongodbUri, {
      dbName: process.env.MONGODB_DB_NAME ?? "examUnit2",
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 5
    });
  }

  return connectionPromise;
}

export async function disconnectFromDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
