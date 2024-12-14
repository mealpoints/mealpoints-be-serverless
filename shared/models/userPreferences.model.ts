import mongoose, { Document, Schema } from "mongoose";
import { DietEnum, ExerciseRoutineEnum, GenderEnum, GoalsEnum, HeightUnitEnum, SleepPatternsEnum, StressLevelsEnum, WeightUnitEnum } from "../types/enums";

export interface IUserPreferences extends Document {
    id: string;
    user: string;
    age?: number;
    gender?: GenderEnum;
    height?: {
        value: number;
        unit: HeightUnitEnum;
    }
    currentWeight?: {
        value: number;
        unit: WeightUnitEnum
    };
    goalWeight?: {
        value: number;
        unit: WeightUnitEnum
    };
    goals?: GoalsEnum; // QA: should we keep it enum? what abt custom entry?
    motivation?: string; // QA: is this even needed ? goals is enough imo.
    medicalConditions?: string;
    exerciseRoutine?: ExerciseRoutineEnum;
    sleepPatterns?: SleepPatternsEnum;
    stressLevels?: StressLevelsEnum;
    familyHistory?: string;
    occupation?: string;
    foodPreferences?: string; // QA: should we make it array of string ?
    excludedFoods?: string; // QA: same as above
    diet?: DietEnum; // QA: same as goals
    createdAt: Date;
}

const userPreferencesSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        age: { type: Number, min: 0 },
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
        goals: { type: String, enum: Object.values(GoalsEnum) },
        motivation: { type: String },
        medicalConditions: { type: String },
        exerciseRoutine: { type: String, enum: Object.values(ExerciseRoutineEnum) },
        sleepPatterns: { type: String, enum: Object.values(SleepPatternsEnum) },
        stressLevels: { type: String, enum: Object.values(StressLevelsEnum) },
        familyHistory: { type: String },
        occupation: { type: String },
        foodPreferences: { type: String },
        excludedFoods: { type: String },
        diet: { type: String, enum: Object.values(DietEnum) },
        createdAt: { type: Date, default: Date.now },
    }
);

const UserPreferences = mongoose.model<IUserPreferences>(
    "UserPreferences",
    userPreferencesSchema
);

export default UserPreferences;