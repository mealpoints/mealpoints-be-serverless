import mongoose, { Document, Schema } from "mongoose";

export interface NutrientInfo {
  value: number;
  unit: string;
  target: number;
}

export interface IBadgeData {
  name: string;
  description: string;
  id: string;
  image: string;
}

// TODO: Move this after MP-13
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

export interface IMealReport extends Document {
  id: string;
  user: string;
  personalityBadge: IBadgeData;
  mealWins: {
    first: IBadgeData;
    second: IBadgeData;
    third: IBadgeData;
  };
  tipsToImproveScore: Array<{
    title: string;
    description: string;
  }>;
  failuresToAvoid: Array<{
    title: string;
    description: string;
  }>;
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
    delta?: number;
    previousWeekAverageScore?: number;
    nextWeekGoal: number;
  };
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMealReportCreate {
  user: string;
  bestMeals: string[];
  worstMeals: string[];
  personalityBadge: IBadgeData;
  mealWins: {
    first: IBadgeData;
    second: IBadgeData;
    third: IBadgeData;
  };
  tipsToImproveScore: Array<{
    title: string;
    description: string;
  }>;
  failuresToAvoid: Array<{
    title: string;
    description: string;
  }>;
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
    delta?: number;
    previousWeekAverageScore?: number;
    nextWeekGoal: number;
  };
  startDate: Date;
  endDate: Date;
}

const nutrientInfoSchema = {
  value: { type: Number, required: true },
  unit: { type: String, required: true },
  target: { type: Number, required: true },
};

const badgeSchma = {
  name: { type: String, required: true },
  description: { type: String, required: true },
  id: { type: String, required: true },
  image: { type: String, required: true },
};

const mealReportSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  personalityBadge: badgeSchma,
  mealWins: {
    first: badgeSchma,
    second: badgeSchma,
    third: badgeSchma,
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
    calories: nutrientInfoSchema,
    protein: nutrientInfoSchema,
    fat: nutrientInfoSchema,
    carbohydrates: nutrientInfoSchema,
    fiber: nutrientInfoSchema,
    sugars: nutrientInfoSchema,
  },
  summary: {
    averageScore: { type: Number, required: true },
    delta: { type: Number },
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
