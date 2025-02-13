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
  height?: number; // in cm
  age?: number; // in years
  gender: GenderEnum;
  physicalActivity: PhysicalActivityEnum;
  targetWeight: number;
  durationMonths?: number;
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

  if (
    height === undefined ||
    age === undefined ||
    durationMonths === undefined
  ) {
    Logger("calculateNutritionBudget").error("Height and age are required");
    throw new Error("Height and age must be provided");
  }

  // 1. Calculate BMR (Basal Metabolic Rate)
  const BMR =
    gender === GenderEnum.Male
      ? 10 * currentWeight + 6.25 * height - 5 * age + 5
      : 10 * currentWeight + 6.25 * height - 5 * age - 161;

  // 2. Total Daily Energy Expenditure (TDEE)
  const TDEE = Math.round(BMR * ACTIVITY_MULTIPLIERS[physicalActivity]);

  // 3. Total weight gain/loss required
  const totalWeightGoal = currentWeight - targetWeight;

  // 4. Weekly weight gain/loss goal
  // const weeklyWeightGoal = Math.round(totalWeightGoal / (durationMonths * 4));

  // 5. Calorie deficit target (each kg = 7700 kcal)
  const dailyCalorieAdjustment = Math.round(
    (totalWeightGoal * 7700) / (durationMonths * 30)
  );

  // 6. Daily calorie target (TDEE ± adjustment based on goal)
  const dailyCalorieTarget = TDEE + dailyCalorieAdjustment;

  // 7. Adjusted daily calorie target (ensuring safe limits, at least 65% of TDEE)
  const adjustedCalorieTarget = Math.round(
    Math.max(dailyCalorieTarget, 0.65 * TDEE)
  );

  // 8. Macronutrient Targets (Protein, Fats, Carbs)
  const proteinTarget = Math.round(
    Math.min(
      Math.max((adjustedCalorieTarget * 0.35) / 4, currentWeight * 1.75),
      currentWeight * 2
    )
  );
  const carbsTarget = Math.round((adjustedCalorieTarget * 0.4) / 4);
  const fatTarget = Math.round((adjustedCalorieTarget * 0.28) / 9);

  return {
    calories: adjustedCalorieTarget,
    protein: proteinTarget,
    fat: fatTarget,
    carbohydrates: carbsTarget,
  };
};
