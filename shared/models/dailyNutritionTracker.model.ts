import mongoose, { Document, Schema } from "mongoose";

interface ITracker {
  target: number;
  consumed?: number;
}

export interface IDailyNutritionTracker extends Document {
  user: string;
  calories: ITracker;
  protein: ITracker;
  fat: ITracker;
  carbohydrates: ITracker;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDailyNutritionTrackerCreate {
  user: string;
  calories: ITracker;
  protein: ITracker;
  fat: ITracker;
  carbohydrates: ITracker;
  date: Date;
}

const TrackerSchema: Schema = new Schema({
  target: { type: Number, required: true },
  consumed: { type: Number },
});

const DailyNutritionTrackerSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  calories: { type: TrackerSchema, required: true },
  protein: { type: TrackerSchema, required: true },
  fat: { type: TrackerSchema, required: true },
  carbohydrates: { type: TrackerSchema, required: true },
  date: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

DailyNutritionTrackerSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (document, returnValue) {
    returnValue.id = returnValue._id;
    delete returnValue._id;
  },
});

DailyNutritionTrackerSchema.index({ user: 1 });

const DailyNutritionTracker = mongoose.model<IDailyNutritionTracker>(
  "DailyNutritionTracker",
  DailyNutritionTrackerSchema
);

export default DailyNutritionTracker;
