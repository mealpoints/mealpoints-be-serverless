import mongoose, { Schema } from "mongoose";

export interface INutritionBudget extends Document {
  user: string;
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  targetWeight: number;
  currentWeight: number;
  targetDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface INutritionBudgetCreate {
  user: string;
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  targetWeight: number;
  currentWeight: number;
  targetDate: Date;
}

const NutritionBudgetSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  fat: { type: Number, required: true },
  carbohydrates: { type: Number, required: true },
  targetWeight: { type: Number, required: true },
  currentWeight: { type: Number, required: true },
  targetDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

NutritionBudgetSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (document, returnValue) {
    returnValue.id = returnValue._id;
    delete returnValue._id;
  },
});

NutritionBudgetSchema.index({ user: 1 });

const NutritionBudget = mongoose.model<INutritionBudget>(
  "NutritionBudget",
  NutritionBudgetSchema
);

export default NutritionBudget;
