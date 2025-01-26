import { IDailyNutritionTracker } from "../../models/dailyNutritionTracker.model";
import {
  convertToHumanReadableMessage,
  createProgressBar,
} from "../../utils/string";

export const dailyBudgetStatus = (
  dailyNutritionTracker: IDailyNutritionTracker
) => {
  const { calories, protein, fat, carbohydrates } = dailyNutritionTracker;

  const caloriesStatus = createProgressBar(calories.consumed, calories.target);
  const proteinStatus = createProgressBar(protein.consumed, protein.target);
  const fatStatus = createProgressBar(fat.consumed, fat.target);
  const carbohydratesStatus = createProgressBar(
    carbohydrates.consumed,
    carbohydrates.target
  );

  return `
  *📊 Nutritional Progress:*
🔥 Calories: ${caloriesStatus} (${calories.consumed || 0}/${
    calories.target
  } kcal)
💪 Protein: ${proteinStatus} (${protein.consumed || 0}/${protein.target} g)
🫒 Fat: ${fatStatus} (${fat.consumed || 0}/${fat.target} g)
🍞 Carbs: ${carbohydratesStatus} (${carbohydrates.consumed || 0}/${
    carbohydrates.target
  } g)
  
`;
};

export const formatMessage = (
  message: string,
  dailyNutritionTracker?: IDailyNutritionTracker
) => {
  let response = "";
  if (dailyNutritionTracker) {
    response += dailyBudgetStatus(dailyNutritionTracker);
  }
  response += convertToHumanReadableMessage(message);
  return response;
};
