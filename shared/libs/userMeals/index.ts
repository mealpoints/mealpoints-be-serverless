import logger from "../../config/logger";
import { IUserMealCreate } from "../../models/userMeal.model";
import * as userMealService from "../../services/userMeal.service";
import { updateDailyNutritionTrackerWithMeal } from "../dailyNutritionTracker";

const Logger = logger("libs/userMeals");

export const createUserMeal = async (data: IUserMealCreate) => {
  // Intentionally out of try catch to make sure we dont fail when updating daily nutrition tracker fails
  await updateDailyNutritionTrackerWithMeal({
    user: data.user,
    calories: data.macros.calories.value,
    protein: data.macros.protein.value,
    fat: data.macros.fat.value,
    carbohydrates: data.macros.carbohydrates.value,
  });

  try {
    Logger("createUserMeal").info("");
    const userMeal = await userMealService.createUserMeal(data);
    return userMeal;
  } catch (error) {
    Logger("createUserMeal").error(error);
    throw error;
  }
};
