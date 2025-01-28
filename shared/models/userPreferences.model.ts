import mongoose, { Document, Schema } from "mongoose";
import {
  ExerciseRoutineEnum,
  GenderEnum,
  HeightUnitEnum,
  LanguagesEnum,
  PhysicalActivityEnum,
  SleepPatternsEnum,
  StressLevelsEnum,
  WeightUnitEnum,
} from "../types/enums";

export interface IUserPreferences extends Document {
  id: string;
  user: string;
  birthYear?: number;
  birthDate?: Date;
  gender?: GenderEnum;
  height?: {
    value: number;
    unit: HeightUnitEnum;
  };
  currentWeight?: {
    value: number;
    unit: WeightUnitEnum;
  };
  goalWeight?: {
    value: number;
    unit: WeightUnitEnum;
  };
  goal?: string;
  medicalConditions?: string;
  physicalActivity?: PhysicalActivityEnum;
  exerciseRoutine?: ExerciseRoutineEnum;
  sleepPatterns?: SleepPatternsEnum;
  stressLevels?: StressLevelsEnum;
  familyHistory?: string;
  occupation?: string;
  foodPreferences?: string;
  excludedFoods?: string;
  diet?: string;
  language?: LanguagesEnum;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserPreferencesCreate {
  user: string;
  birthYear?: number;
  birthDate?: Date;
  gender?: GenderEnum;
  height?: {
    value: number;
    unit: HeightUnitEnum;
  };
  currentWeight?: {
    value: number;
    unit: WeightUnitEnum;
  };
  goalWeight?: {
    value: number;
    unit: WeightUnitEnum;
  };
  goal?: string;
  medicalConditions?: string;
  physicalActivity?: PhysicalActivityEnum;
  exerciseRoutine?: ExerciseRoutineEnum;
  sleepPatterns?: SleepPatternsEnum;
  stressLevels?: StressLevelsEnum;
  familyHistory?: string;
  occupation?: string;
  foodPreferences?: string;
  excludedFoods?: string;
  diet?: string;
  language?: LanguagesEnum;
}

const userPreferencesSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    birthYear: { type: Number, min: 1900 },
    birthDate: { type: Date },
    gender: { type: String, enum: Object.values(GenderEnum) },
    height: {
      value: { type: Number, min: 0 },
      unit: { type: String, enum: Object.values(HeightUnitEnum) },
    },
    currentWeight: {
      value: { type: Number, min: 0 },
      unit: { type: String, enum: Object.values(WeightUnitEnum) },
    },
    goalWeight: {
      value: { type: Number, min: 0 },
      unit: { type: String, enum: Object.values(WeightUnitEnum) },
    },
    goal: { type: String },
    physicalActivity: {
      type: String,
      enum: Object.values(PhysicalActivityEnum),
    },
    medicalConditions: { type: String },
    exerciseRoutine: { type: String, enum: Object.values(ExerciseRoutineEnum) },
    sleepPatterns: { type: String, enum: Object.values(SleepPatternsEnum) },
    stressLevels: { type: String, enum: Object.values(StressLevelsEnum) },
    familyHistory: { type: String },
    occupation: { type: String },
    foodPreferences: { type: String },
    excludedFoods: { type: String },
    diet: { type: String },
    language: {
      type: String,
      enum: Object.values(LanguagesEnum),
      required: true,
      default: LanguagesEnum.English,
    },
  },
  { timestamps: true }
);

userPreferencesSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (document, returnValue) {
    returnValue.id = returnValue._id;
    delete returnValue._id;
  },
});

const UserPreferences = mongoose.model<IUserPreferences>(
  "UserPreferences",
  userPreferencesSchema
);

export default UserPreferences;
