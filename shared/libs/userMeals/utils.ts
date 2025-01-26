import { IDailyNutritionTracker } from "../../models/dailyNutritionTracker.model";
import { Food } from "../../types/openai";
import {
  convertToHumanReadableMessage,
  createProgressBar,
} from "../../utils/string";

export const dailyBudgetStatus = (
  dailyNutritionTracker: IDailyNutritionTracker
) => {
  const { calories, protein, fat, carbohydrates } = dailyNutritionTracker;

  const caloriesStatus = createProgressBar(
    calories.consumed,
    calories.target,
    7
  );
  const proteinStatus = createProgressBar(protein.consumed, protein.target, 7);
  const fatStatus = createProgressBar(fat.consumed, fat.target, 7);
  const carbohydratesStatus = createProgressBar(
    carbohydrates.consumed,
    carbohydrates.target,
    7
  );

  return `
  *📊 Today’s Goals::*
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
  mealResponse: Food,
  dailyNutritionTracker?: IDailyNutritionTracker
) => {
  const { meal, suggestion } = mealResponse;

  let response = "";
  if (dailyNutritionTracker) {
    response += dailyBudgetStatus(dailyNutritionTracker);
  }

  const mealData = `
🥗 ${meal.name} (${meal.score.value}/${meal.score.max})
~${meal.macros.calories} kcal | ${meal.macros.protein}g protein | ${
    meal.macros.carbohydrates
  }g carbs | ${meal.macros.fat}g fats

💡 Tip to Elevate It: ${convertToHumanReadableMessage(suggestion)} 🌟
  `;

  response += mealData;

  return response;
};
