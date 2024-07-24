import logger from "../config/logger";
import { IUserMeal } from "../models/userMeal.model";
import { ReportPeriod } from "../types/report";
import * as userMealService from "./userMeal.service";

const Logger = logger("report.service");

export const getReport = async (userId: string, period: ReportPeriod) => {
  Logger("getReport").debug("");
  const userMeals = await userMealService.getPeriodicUserMealsByUserId(
    userId,
    period
  );

  const scoreData = {
    toalScore: 0,
    maxScore: 0,
  };

  const sumOfMacros = {
    calories: 0,
    protein: 0,
    fat: 0,
    carbohydrates: 0,
    fiber: 0,
    sugars: 0,
    score: 0,
  };

  userMeals.forEach((userMeal: IUserMeal) => {
    sumOfMacros.calories += userMeal.macros.calories.value;
    sumOfMacros.protein += userMeal.macros.protein.value;
    sumOfMacros.fat += userMeal.macros.fat.value;
    sumOfMacros.carbohydrates += userMeal.macros.carbohydrates.value;
    sumOfMacros.fiber += userMeal.macros.fiber.value;
    sumOfMacros.sugars += userMeal.macros.sugars.value;
    scoreData.toalScore += userMeal.score.value;
    scoreData.maxScore += userMeal.score.total;
  });
  return {
    averageScore:
      Math.round((scoreData.toalScore / userMeals.length) * 100) / 100,
    score: {
      toalScore: scoreData.toalScore,
      maxScore: scoreData.maxScore,
    },
    sumOfMacros,
    totalMeals: userMeals.length,
    userMeals,
  };
};
