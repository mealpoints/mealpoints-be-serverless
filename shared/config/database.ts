import mongoose from "mongoose";

let isConnected: boolean;

export const connectToDatabase = async (): Promise<void> => {
  if (isConnected) {
    console.info(
      "[config/database/connectToDatabase]: Database is already connected"
    );
    return;
  }

  try {
    console.info("[config/database/connectToDatabase]: Connecting to database");
    await mongoose.connect(process.env.MONGODB_URI as string, {
      serverSelectionTimeoutMS: 5000,
      dbName: process.env.MONGODB_DB,
    });
  } catch (error) {
    console.error(
      "[config/database/connectToDatabase]: Error connecting to database:",
      error
    );
    throw new Error("Error connecting to database");
  }

  isConnected = !!mongoose.connection.readyState;
};
