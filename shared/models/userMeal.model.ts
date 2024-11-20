import mongoose, { Document, Schema } from "mongoose";
import { NutritionalData } from "../types/openai";
import { PaginateModel, paginatePlugin } from "../utils/mongoosePlugins";

export interface IUserMeal extends Document {
  id: string;
  user: string;
  image: string;
  name: string;
  score: {
    value: number;
    total: number;
  };
  macros: NutritionalData;
  localTime: string;
  createdAt: Date;
}

export interface IUserMealCreate {
  user: string;
  image: string;
  name: string;
  score: {
    value: number;
    total: number;
  };
  localTime: string;
  macros: NutritionalData;
}

const UserMealSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  name: { type: String },
  image: { type: String },
  score: { type: Object },
  macros: { type: Object },
  localTime: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

UserMealSchema.plugin(paginatePlugin);

const UserMeal = mongoose.model<IUserMeal, PaginateModel<IUserMeal>>(
  "UserMeal",
  UserMealSchema
);
export default UserMeal;
