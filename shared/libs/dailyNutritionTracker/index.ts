import logger from "../../config/logger";
import { IDailyNutritionTracker } from "../../models/dailyNutritionTracker.model";
import * as dailyNutritionTrackerService from "../../services/dailyNutritionTracker.service";
import * as nutritionBudgetService from "../../services/nutritionBudget.service";
import { Macros } from "../../types/openai";

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

interface IUpdateDailyNutritionTrackerWithMeal {
  user: string;
  macros: Macros;
  operation?: "add" | "subtract";
}

export const updateDailyNutritionTrackerWithMeal = async ({
  user,
  macros,
  operation = "add",
}: IUpdateDailyNutritionTrackerWithMeal) => {
  Logger("updateDailyNutritionTrackerWithMeal").info("");
  try {
    const dailyNutritionTracker = await ensureDailyNutritionTrackerExists(user);

    const multiplier = operation === 'add' ? 1 : -1;
    const nutrients = ["calories", "protein", "fat", "carbohydrates"] as const;
    nutrients.forEach((nutrient) => {
      dailyNutritionTracker[nutrient].consumed = Math.round(
        (dailyNutritionTracker[nutrient].consumed || 0) + multiplier * macros[nutrient]
      );
    });

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
