import mongoose from "mongoose";

let isConnected: boolean;

export const connectToDatabase = async (): Promise<void> => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
  } catch (error) {
    throw new Error("Error connecting to database");
  }

  isConnected = !!mongoose.connection.readyState;
};
