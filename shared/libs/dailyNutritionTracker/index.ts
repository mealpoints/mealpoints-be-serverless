import logger from "../../config/logger";
import { IDailyNutritionTracker } from "../../models/dailyNutritionTracker.model";
import * as dailyNutritionTrackerService from "../../services/dailyNutritionTracker.service";
import * as nutritionBudgetService from "../../services/nutritionBudget.service";

const Logger = logger("dailyNutritionTracker.service");

export const initDailyNutritionTracker = async (user: string) => {
  try {
    Logger("initDailyNutritionTracker").info("");
    const nutritionBudget =
      await nutritionBudgetService.getNutritionBudgetByUser(user);

    if (!nutritionBudget) {
      Logger("initDailyNutritionTracker").info(
        `No nutrition budget found for ${user}`
      );
      throw new Error("No nutrition budget found for user");
    }

    const dailyNutritionTracker =
      await dailyNutritionTrackerService.createDailyNutritionTracker({
        user: user,
        calories: {
          target: nutritionBudget.calories,
        },
        protein: {
          target: nutritionBudget.protein,
        },
        fat: {
          target: nutritionBudget.fat,
        },
        carbohydrates: {
          target: nutritionBudget.carbohydrates,
        },
        date: new Date(),
      });

    return dailyNutritionTracker;
  } catch (error) {
    Logger("initDailyNutritionTracker").error(JSON.stringify(error));
    throw error;
  }
};

interface IUpdateDailyNutritionTrackerWithMeal {
  user: string;
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
}

export const ensureDailyNutritionTrackerExists = async (
  user: string
): Promise<IDailyNutritionTracker> => {
  try {
    Logger("ensureDailyNutritionTrackerExists").info("");
    let dailyNutritionTracker =
      await dailyNutritionTrackerService.getDailyNutritionTrackerByUser(
        user,
        new Date()
      );

    if (!dailyNutritionTracker) {
      Logger("ensureDailyNutritionTrackerExists").info(
        `No daily nutrition tracker found for ${user}`
      );
      dailyNutritionTracker = await initDailyNutritionTracker(user);
    }
    return dailyNutritionTracker;
  } catch (error) {
    Logger("ensureDailyNutritionTrackerExists").error(JSON.stringify(error));
    throw error;
  }
};

export const updateDailyNutritionTrackerWithMeal = async (
  data: IUpdateDailyNutritionTrackerWithMeal
) => {
  Logger("updateDailyNutritionTrackerWithMeal").info("");
  try {
    const dailyNutritionTracker = await ensureDailyNutritionTrackerExists(
      data.user
    );

    // Update consumed nutrition
    dailyNutritionTracker.calories.consumed =
      (dailyNutritionTracker.calories.consumed || 0) + data.calories;
    dailyNutritionTracker.protein.consumed =
      (dailyNutritionTracker.protein.consumed || 0) + data.protein;
    dailyNutritionTracker.fat.consumed =
      (dailyNutritionTracker.fat.consumed || 0) + data.fat;
    dailyNutritionTracker.carbohydrates.consumed =
      (dailyNutritionTracker.carbohydrates.consumed || 0) + data.carbohydrates;

    const updatedDailyNutritionTracker =
      await dailyNutritionTrackerService.updateDailyNutritionTracker(
        dailyNutritionTracker
      );

    return updatedDailyNutritionTracker;
  } catch (error) {
    Logger("updateDailyNutritionTrackerWithMeal").error(JSON.stringify(error));
    throw error;
  }
};
