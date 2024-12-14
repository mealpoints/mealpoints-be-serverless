import mongoose, { Document, Schema } from "mongoose";
import { DietEnum, ExerciseRoutineEnum, GenderEnum, GoalsEnum, HeightUnitEnum, SleepPatternsEnum, StressLevelsEnum, WeightUnitEnum } from "../types/enums";

export interface IUserPreferences extends Document {
    id: string;
    user: string;

    age: number;
    gender: GenderEnum;
    height: {
        value: number;
        unit: HeightUnitEnum;
    }
    currentWeight: {
        value: number;
        unit: WeightUnitEnum
    };

    goalWeight?: {
        value: number;
        unit: WeightUnitEnum
    };
    goals: GoalsEnum;
    motivation?: string;

    medicalConditions?: string;
    exerciseRoutine?: ExerciseRoutineEnum;
    sleepPatterns?: SleepPatternsEnum;
    stressLevels: StressLevelsEnum;
    familyHistory?: string;
    occupation?: string;

    foodPreferences?: string;
    excludedFoods?: string;
    diet: DietEnum;

    createdAt: Date;
    updatedAt: Date;
}

const userPreferencesSchema = new Schema<IUserPreferences>(
    {
        age: { type: Number, min: 0, required: true },
        gender: { type: String, enum: Object.values(GenderEnum), required: true },
        height: {
            value: { type: Number, min: 0, required: true },
            unit: { type: String, enum: Object.values(HeightUnitEnum), default: HeightUnitEnum.CM },
        },
        currentWeight: {
            value: { type: Number, min: 0, required: true },
            unit: { type: String, enum: Object.values(WeightUnitEnum), default: WeightUnitEnum.KG },
        },
        goalWeight: {
            value: { type: Number, min: 0 },
            unit: { type: String, enum: Object.values(WeightUnitEnum), default: WeightUnitEnum.KG },
        },
        medicalConditions: { type: String },
        familyHistory: { type: String },
        occupation: { type: String },
        exerciseRoutine: { type: String, enum: Object.values(ExerciseRoutineEnum) },
        sleepPatterns: { type: String, enum: Object.values(SleepPatternsEnum) },
        stressLevels: {
            type: String,
            enum: Object.values(StressLevelsEnum),
            default: StressLevelsEnum.Moderate,
        },
        foodPreferences: { type: String },
        excludedFoods: { type: String },
        diet: {
            type: String,
            enum: Object.values(DietEnum),
            default: DietEnum.None,
        },
        motivation: { type: String },
        goals: { type: String, enum: Object.values(GoalsEnum), required: true },
    },
    {
        timestamps: true,
    }
);

const UserPreferences = mongoose.model<IUserPreferences>(
    "UserPreferences",
    userPreferencesSchema
);

export default UserPreferences;