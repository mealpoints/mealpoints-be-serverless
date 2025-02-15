import { differenceInDays } from "date-fns";
import { isNaN } from "lodash";
import { ACTIVITY_MULTIPLIERS } from "../../../../../shared/config/config";
import logger from "../../../../../shared/config/logger";
import {
  GenderEnum,
  PhysicalActivityEnum,
} from "../../../../../shared/types/enums";
import { Macros } from "../../../../../shared/types/openai";
const Logger = logger("flowReply/utils");

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

export const getAge = (date_: Date) => {
  const now = new Date();
  const age = now.getFullYear() - date_.getFullYear();
  return isNaN(age) ? undefined : age;
};

export const getDurationMonths = (date_: Date) => {
  if (date_ === undefined) return undefined;
  const now = new Date();
  return differenceInDays(date_, now) / 30.44;
};

export interface ICalculateNutritionBudgetArguments {
  currentWeight: number; // in kg
  height: number; // in cm
  age: number;
  gender: GenderEnum;
  physicalActivity: PhysicalActivityEnum;
  targetWeight: number;
  durationMonths: number;
}

export const calculateNutritionBudget = (
  input: ICalculateNutritionBudgetArguments
): Macros => {
  Logger("calculateNutritionBudget").info("");
  const {
    currentWeight,
    height,
    age,
    gender,
    physicalActivity,
    targetWeight,
    durationMonths,
  } = input;

  const validDurationMonths = durationMonths <= 0 ? 0.01 : durationMonths;

  // 1. Calculate BMR
  const rawBMR =
    gender === GenderEnum.Male
      ? 10 * currentWeight + 6.25 * height - 5 * age + 5
      : 10 * currentWeight + 6.25 * height - 5 * age - 161;
  const BMR = Math.round(rawBMR);

  // 2. Calculate TDEE
  const TDEE = Math.round(BMR * ACTIVITY_MULTIPLIERS[physicalActivity]);

  // 3. Calculate Total Weight Change (kg)
  const weightChange = Math.abs(targetWeight - currentWeight);

  // 4. Calculate Daily Calorie Adjustment (Deficit or Surplus)
  const dailyCalorieAdjustment = Math.round(
    (weightChange * 7700) / (validDurationMonths * 30)
  );

  // 5. Determine the Calculated Daily Calorie Target
  let calculatedDailyCalTarget = TDEE;
  if (targetWeight > currentWeight) {
    calculatedDailyCalTarget = TDEE + dailyCalorieAdjustment;
  } else if (targetWeight < currentWeight) {
    calculatedDailyCalTarget = TDEE - dailyCalorieAdjustment;
  }

  // 6. Adjusted Daily Calorie Target
  const adjustedDailyCalTarget = Math.round(
    Math.max(calculatedDailyCalTarget, 0.65 * TDEE)
  );

  // 7. Calculate Macronutrient Targets
  const proteinTarget = Math.round(
    Math.min(
      Math.max((adjustedDailyCalTarget * 0.35) / 4, currentWeight * 1.75),
      currentWeight * 2
    )
  );
  const carbsTarget = Math.round((adjustedDailyCalTarget * 0.4) / 4);
  const fatTarget = Math.round((adjustedDailyCalTarget * 0.28) / 9);

  return {
    calories: adjustedDailyCalTarget,
    protein: proteinTarget,
    fat: fatTarget,
    carbohydrates: carbsTarget,
  };
};
