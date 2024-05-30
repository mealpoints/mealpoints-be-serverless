import mongoose from "mongoose";
import { config } from "./env";

const connect = () =>
  mongoose.connect(config.mongoose.url, config.mongoose.options as any);

export const db = {
  connect,
};
