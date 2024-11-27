import * as _ from "lodash";
import { MEAL_REPORT } from "../../../../shared/config/config";
import logger from "../../../../shared/config/logger";
import {
  IMealReport,
  IMealReportFromOpenAI,
} from "../../../../shared/models/mealReport.model";
import { IUserMeal } from "../../../../shared/models/userMeal.model";

const Logger = logger("message-processor/lib/meal-report/util");

export const getTop3BestAndWorstMeals = (
  meals: IUserMeal[]
): {
  bestMeals: string[];
  worstMeals: string[];
} => {
  // Write the ligic to get top 3 best and worst meals
  const sortedMeals = [...meals].sort((a, b) => b.score.value - a.score.value);
  // Get the top 3 best meals
  const bestMeals = sortedMeals.slice(0, 3).map((meal) => meal.id);

  // Get the top 3 worst meals
  const worstMeals = sortedMeals
    .slice(-3)
    .reverse()
    .map((meal) => meal.id);

  return { bestMeals, worstMeals };
};

export const getMetadata = (meals: IUserMeal[]): IMealReport["metadata"] => {
  let totalCalories: number = 0;
  let totalProtein: number = 0;
  let totalFat: number = 0;
  let totalCarbohydrates: number = 0;
  let totalFiber: number = 0;
  let totalSugars: number = 0;

  // Calculate totals
  meals.forEach((meal: IUserMeal) => {
    totalCalories += meal.macros.calories.value;
    totalProtein += meal.macros.protein.value;
    totalFat += meal.macros.fat.value;
    totalCarbohydrates += meal.macros.carbohydrates.value;
    totalFiber += meal.macros.fiber.value;
    totalSugars += meal.macros.sugars.value;
  });

  const metadata = {
    calories: {
      value: totalCalories,
      unit: "kcal",
      target: 2000, // Temp values as we do not set targets yet. We will not use this in the FE.
    },
    protein: {
      value: totalProtein,
      unit: "g",
      target: 150, // Temp values as we do not set targets yet. We will not use this in the FE.
    },
    fat: {
      value: totalFat,
      unit: "g",
      target: 70, // Temp values as we do not set targets yet. We will not use this in the FE.
    },
    carbohydrates: {
      value: totalCarbohydrates,
      unit: "g",
      target: 300, // Temp values as we do not set targets yet. We will not use this in the FE.
    },
    fiber: {
      value: totalFiber,
      unit: "g",
      target: 30, // Temp values as we do not set targets yet. We will not use this in the FE.
    },
    sugars: {
      value: totalSugars,
      unit: "g",
      target: 40, // Temp values as we do not set targets yet. We will not use this in the FE.
    },
  };
  return metadata;
};

export function calculateTargetScore(
  averageScore: number,
  previousWeekAverageScore?: number
): number {
  // Calculate the total improvement required over the improvement period
  const totalImprovement = averageScore * MEAL_REPORT.improvementFactor;

  // Calculate the weekly improvement factor
  const weeklyImprovement = totalImprovement / MEAL_REPORT.weeks;

  // If previousWeekAverageScore is undefined (first week), use averageScore as the baseline
  const baselineScore = previousWeekAverageScore || averageScore;

  // Calculate the target score for the current week
  const targetScore = baselineScore + weeklyImprovement;

  // Ensure the target score does not exceed 10.0
  return Math.min(targetScore, MEAL_REPORT.maxScore);
}

function generateScoreComparisonMessage(
  previousWeekAverageScore: number,
  averageScore: number
): string {
  const scoreDifference = averageScore - previousWeekAverageScore;

  if (scoreDifference > 0) {
    return `Your score has increased by ${scoreDifference.toFixed(1)} points!`;
  } else if (scoreDifference < 0) {
    return `Your score has decreased by ${Math.abs(scoreDifference).toFixed(
      1
    )} points.`;
  } else {
    return `Your score remained the same as last week.`;
  }
}

export const getSummary = (
  meals: IUserMeal[],
  previousWeekAverageScore?: number
): IMealReport["summary"] => {
  let totalScore: number = 0;

  meals.forEach((meal: IUserMeal) => {
    totalScore += meal.score.value;
  });

  const averageScore = _.round(totalScore / meals.length, 2);

  const delta = previousWeekAverageScore
    ? generateScoreComparisonMessage(previousWeekAverageScore, averageScore)
    : undefined;

  const nextWeekGoal = calculateTargetScore(
    averageScore,
    previousWeekAverageScore
  );

  return {
    averageScore,
    delta,
    previousWeekAverageScore,
    nextWeekGoal,
  };
};

export const validateOpenAIResult = (
  result: IMealReportFromOpenAI
): boolean => {
  Logger("validateOpenAIResult").info("");
  if (!result) {
    Logger("validateOpenAIResult").error("No response from OpenAI");
    return false;
  }
  const requiredFields = [
    "personalityBadge",
    "mealWins",
    "tipsToImproveScore",
    "failuresToAvoid",
  ];

  for (const field of requiredFields) {
    if (!(field in result)) {
      Logger("validateOpenAIResult").error(`Missing ${field}`);
      return false;
    }
  }
  return true;
};
