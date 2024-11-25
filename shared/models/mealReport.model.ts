import mongoose, { Document, Schema } from "mongoose";

export interface NutrientInfo {
  value: number;
  unit: string;
  target: number;
}

export interface IMealReportFromOpenAI {
  personalityBadge: string;
  mealWins: {
    first: string;
    second: string;
    third: string;
  };
  tipsToImproveScore: Array<{
    title: string;
    description: string;
  }>;
  failuresToAvoid: Array<{
    title: string;
    description: string;
  }>;
}

export interface IMealReport extends Document, IMealReportFromOpenAI {
  id: string;
  user: string;
  bestMeals: string[];
  worstMeals: string[];
  metadata: {
    calories: NutrientInfo;
    protein: NutrientInfo;
    fat: NutrientInfo;
    carbohydrates: NutrientInfo;
    fiber: NutrientInfo;
    sugars: NutrientInfo;
  };
  summary: {
    averageScore: number;
    delta?: string;
    previousWeekAverageScore?: number;
    nextWeekGoal: number;
  };
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMealReportCreate extends IMealReportFromOpenAI {
  user: string;
  bestMeals: string[];
  worstMeals: string[];
  metadata: {
    calories: NutrientInfo;
    protein: NutrientInfo;
    fat: NutrientInfo;
    carbohydrates: NutrientInfo;
    fiber: NutrientInfo;
    sugars: NutrientInfo;
  };
  summary: {
    averageScore: number;
    delta?: string;
    previousWeekAverageScore?: number;
    nextWeekGoal: number;
  };
  startDate: Date;
  endDate: Date;
}

const mealReportSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  personalityBadge: { type: String, required: true },
  mealWins: {
    first: { type: String, required: true },
    second: { type: String, required: true },
    third: { type: String, required: true },
  },
  tipsToImproveScore: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
    },
  ],
  failuresToAvoid: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
    },
  ],
  bestMeals: [{ type: Schema.Types.ObjectId, ref: "UserMeal" }],
  worstMeals: [{ type: Schema.Types.ObjectId, ref: "UserMeal" }],
  metadata: {
    calories: {
      value: { type: Number, required: true },
      unit: { type: String, required: true },
      target: { type: Number, required: true },
    },
    protein: {
      value: { type: Number, required: true },
      unit: { type: String, required: true },
      target: { type: Number, required: true },
    },
    fat: {
      value: { type: Number, required: true },
      unit: { type: String, required: true },
      target: { type: Number, required: true },
    },
    carbohydrates: {
      value: { type: Number, required: true },
      unit: { type: String, required: true },
      target: { type: Number, required: true },
    },
    fiber: {
      value: { type: Number, required: true },
      unit: { type: String, required: true },
      target: { type: Number, required: true },
    },
    sugars: {
      value: { type: Number, required: true },
      unit: { type: String, required: true },
      target: { type: Number, required: true },
    },
  },
  summary: {
    averageScore: { type: Number, required: true },
    delta: { type: String },
    previousWeekAverageScore: { type: Number },
    nextWeekGoal: { type: Number, required: true },
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create an index on the user key
mealReportSchema.index({ user: 1 });

const MealReport = mongoose.model<IMealReport>("MealReport", mealReportSchema);
export default MealReport;
