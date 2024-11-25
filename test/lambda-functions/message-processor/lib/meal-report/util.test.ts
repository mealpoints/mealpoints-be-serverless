import { getTop3BestAndWorstMeals } from "../../../../../lambda-functions/message-processor/lib/meal-report/util";
import { IUserMeal } from "../../../../../shared/models/userMeal.model";

describe("getTop3BestAndWorstMeals", () => {
  it("should return the top 3 best and worst meals by id", () => {
    const meals: Partial<IUserMeal>[] = [
      { id: "1", name: "Meal 1", score: { value: 8.5, total: 10 } },
      { id: "2", name: "Meal 2", score: { value: 9, total: 10 } },
      { id: "3", name: "Meal 3", score: { value: 7.5, total: 10 } },
      { id: "4", name: "Meal 4", score: { value: 6, total: 10 } },
      { id: "5", name: "Meal 5", score: { value: 9.5, total: 10 } },
      { id: "6", name: "Meal 6", score: { value: 5, total: 10 } },
      { id: "7", name: "Meal 7", score: { value: 8, total: 10 } },
    ];

    const result = getTop3BestAndWorstMeals(meals as IUserMeal[]);
    expect(result.bestMeals).toEqual(["5", "2", "1"]);
    expect(result.worstMeals).toEqual(["6", "4", "3"]);
  });

  it("should handle less than 6 meals", () => {
    const meals: Partial<IUserMeal>[] = [
      { id: "1", name: "Meal 1", score: { value: 8.5, total: 10 } },
      { id: "2", name: "Meal 2", score: { value: 9, total: 10 } },
      { id: "3", name: "Meal 3", score: { value: 7.5, total: 10 } },
    ];

    const result = getTop3BestAndWorstMeals(meals as IUserMeal[]);
    expect(result.bestMeals).toEqual(["2", "1", "3"]);
    expect(result.worstMeals).toEqual(["3", "1", "2"]);
  });

  it("should handle empty meals array", () => {
    const meals: IUserMeal[] = [];

    const result = getTop3BestAndWorstMeals(meals);
    expect(result.bestMeals).toEqual([]);
    expect(result.worstMeals).toEqual([]);
  });

  it("should handle meals with equal scores", () => {
    const meals: Partial<IUserMeal>[] = [
      { id: "1", name: "Meal 1", score: { value: 8.1, total: 10 } },
      { id: "2", name: "Meal 2", score: { value: 8.5, total: 10 } },
      { id: "3", name: "Meal 3", score: { value: 8.5, total: 10 } },
      { id: "4", name: "Meal 4", score: { value: 8.5, total: 10 } },
      { id: "5", name: "Meal 5", score: { value: 8.5, total: 10 } },
      { id: "6", name: "Meal 6", score: { value: 8.5, total: 10 } },
      { id: "7", name: "Meal 7", score: { value: 8.9, total: 10 } },
      { id: "8", name: "Meal 8", score: { value: 8.9, total: 10 } },
    ];

    const result = getTop3BestAndWorstMeals(meals as IUserMeal[]);
    console.log(result);

    expect(result.bestMeals).toEqual(["7", "8", "2"]);
    expect(result.worstMeals).toEqual(["1", "6", "5"]);
  });
});
