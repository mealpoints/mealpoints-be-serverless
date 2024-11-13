import { calculateMealData } from "../../../../../lambda-functions/message-processor/lib/meal-sumary";
import { USER_MEAL } from "../../../../mocks/meals.mock";

describe("calculateMealData", () => {
  it("should calculate meal data correctly for valid input", () => {
    const input = [USER_MEAL.kadhiPakoraWithRoti, USER_MEAL.rajmaChawal];
    const expectedOutput = {
      averageMealScore: "8.15",
      topMealCalories: "400/kcal",
      topMealCarbs: "60/grams",
      topMealFat: "12/grams",
      topMealFiber: "6/grams",
      topMealName: "Rajma Chawal",
      topMealProtein: "15/grams",
      topMealScore: "8.5",
      topMealSugars: "7/grams",
      totalCalories: "750/kcal",
    };
    const result = calculateMealData(input);
    expect(result).toEqual(expectedOutput);
  });
});
