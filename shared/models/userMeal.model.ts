import mongoose, { Document } from "mongoose";
import { Macros } from "../types/openai";
import { PaginateModel, paginatePlugin } from "../utils/mongoosePlugins";

export interface IUserMeal extends Document {
  id: string;
  user: string;
  image?: string;
  name: string;
  score: {
    value: number;
    max: number;
  };
  macros: Macros;
  localTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMealCreate {
  user: string;
  image?: string;
  name: string;
  score: {
    value: number;
    max: number;
  };
  macros: Macros;
  localTime: Date;
}

const ScoreSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  max: { type: Number, required: true },
});

// Define the Macros schema
const MacrosSchema = new mongoose.Schema({
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  fat: { type: Number, required: true },
  carbohydrates: { type: Number, required: true },
});

// Define the main MealResponse schema
const UserMealSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    score: { type: ScoreSchema, required: true },
    macros: { type: MacrosSchema, required: true },
    image: { type: String },
    localTime: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

// Export the model
module.exports = mongoose.model("UserMeal", UserMealSchema);

UserMealSchema.plugin(paginatePlugin);

UserMealSchema.index({ user: 1 });

UserMealSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (document, returnValue) {
    returnValue.id = returnValue._id;
    delete returnValue._id;
  },
});

const UserMeal = mongoose.model<IUserMeal, PaginateModel<IUserMeal>>(
  "UserMeal",
  UserMealSchema
);
export default UserMeal;
