import mongoose from "mongoose";

let isConnected: boolean;

export const connectToDatabase = async (): Promise<void> => {
  if (isConnected) {
    console.debug(
      "[config/database/connectToDatabase]: Database is already connected"
    );
    return;
  }

  try {
    console.debug(
      "[config/database/connectToDatabase]: Connecting to database"
    );
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

export const closeDBconnection = async (): Promise<void> => {
  if (!isConnected) {
    console.debug(
      "[config/database/closeDBconnection]: Database is already disconnected"
    );
    return;
  }

  try {
    console.debug(
      "[config/database/closeDBconnection]: Disconnecting from database"
    );
    await mongoose.connection.close();
  } catch (error) {
    console.error(
      "[config/database/closeDBconnection]: Error disconnecting from database:",
      error
    );
    throw new Error("Error disconnecting from database");
  } finally {
    isConnected = false;
  }
};
