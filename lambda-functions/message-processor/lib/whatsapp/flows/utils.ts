import { isNaN } from "lodash";
import logger from "../../../../../shared/config/logger";
import {
  GenderEnum,
  PhysicalActivityEnum,
} from "../../../../../shared/types/enums";
const Logger = logger("flowReply/utils");

const ACTIVITY_MULTIPLIERS: Record<PhysicalActivityEnum, number> = {
  [PhysicalActivityEnum.Sedentary]: 1.2,
  [PhysicalActivityEnum.Light]: 1.375,
  [PhysicalActivityEnum.Moderate]: 1.55,
  [PhysicalActivityEnum.Active]: 1.725,
  [PhysicalActivityEnum.VeryActive]: 1.9,
};

export const getNumber = (number_: string | undefined) => {
  if (
    number_ === undefined ||
    typeof number_ !== "string" ||
    number_.trim() === ""
  )
    return undefined;
  const number = Number(number_);
  return isNaN(number) ? undefined : number;
};

export const getDate = (date_: string | undefined) => {
  if (date_ === undefined || typeof date_ !== "string") return undefined;
  const date = new Date(date_.trim());
  return isNaN(date.getTime()) ? undefined : date;
};

interface CalorieInput {
  weight: number; // in kg
  height: number; // in cm
  age: number; // in years
  gender: GenderEnum;
  physicalActivity: PhysicalActivityEnum;
  targetWeight: number;
  durationMonths: number;
}

interface CaloriePlan {
  BMR: number;
  TDEE: number;
  totalWeightLoss: number;
  weeklyWeightLoss: number;
  calorieDeficitTarget: number;
  dailyCalorieDeficit: number;
  adjustedCalorieDeficit: number;
  proteinTarget: number;
  fatTarget: number;
  carbsTarget: number;
}

export const calculateCaloriePlan = (input: CalorieInput): CaloriePlan => {
  Logger("calculateCaloriePlan").info("");
  const {
    weight,
    height,
    age,
    gender,
    physicalActivity,
    targetWeight,
    durationMonths,
  } = input;

  if (
    ![weight, height, age, targetWeight, durationMonths].every((v) => v > 0)
  ) {
    Logger("calculateCaloriePlan").error("Invalid inputs");
    throw new Error("Invalid inputs");
  }

  // 1. Calculate BMR (Basal Metabolic Rate)
  const BMR =
    gender === GenderEnum.Male
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  // 2. Total Daily Energy Expenditure (TDEE)
  const TDEE = Math.round(BMR * ACTIVITY_MULTIPLIERS[physicalActivity]);

  // 3. Total weight loss required
  const totalWeightLoss = weight - targetWeight;

  // 4. Weekly weight loss goal
  const weeklyWeightLoss = Math.round(totalWeightLoss / (durationMonths * 4));

  // 5. Calorie deficit target (each kg = 7700 kcal)
  const calorieDeficitTarget = Math.round(
    (totalWeightLoss * 7700) / (durationMonths * 30)
  );

  // 6. Daily calorie deficit
  const dailyCalorieDeficit = TDEE - calorieDeficitTarget;

  // 7. Adjusted daily calorie target (not too aggressive)
  const adjustedCalorieDeficit = Math.round(
    Math.max(dailyCalorieDeficit, 0.65 * TDEE)
  );

  // 8. Macronutrient Targets (Protein, Fats, Carbs)
  const proteinTarget = Math.round(
    Math.max((adjustedCalorieDeficit * 0.35) / 4, weight * 1.75)
  );
  const fatTarget = Math.round((adjustedCalorieDeficit * 0.28) / 9);
  const carbsTarget = Math.round((adjustedCalorieDeficit * 0.4) / 4);

  return {
    BMR,
    TDEE,
    totalWeightLoss,
    weeklyWeightLoss,
    calorieDeficitTarget,
    dailyCalorieDeficit,
    adjustedCalorieDeficit,
    proteinTarget,
    fatTarget,
    carbsTarget,
  };
};
