import logger from "../config/logger";
import NutritionBudget, {
  INutritionBudget,
  INutritionBudgetCreate,
} from "../models/nutritionBudget.model";

const Logger = logger("nutritionBudget.service");

export const createNutritionBudget = async (
  data: INutritionBudgetCreate
): Promise<INutritionBudget> => {
  try {
    Logger("createNutritionBudget").info("");
    const nutritionBudget = await NutritionBudget.create(data);
    return nutritionBudget;
  } catch (error) {
    Logger("createNutritionBudget").error(JSON.stringify(error));
    throw error;
  }
};

export const getNutritionBudgetByUser = async (
  userId: string
): Promise<INutritionBudget | null> => {
  try {
    Logger("getNutritionBudgetByUser").info("");

    const nutritionBudget = await NutritionBudget.findOne({
      user: userId,
    }).sort({ createdAt: -1 });

    return nutritionBudget;
  } catch (error) {
    Logger("getNutritionBudgetByUser").error(JSON.stringify(error));
    throw error;
  }
};
