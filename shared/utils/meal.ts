import { OpenAIResponse } from "../types/openai";
import { IUserWithLastMeal, IUserWithMeals } from "../types/queueMessages";

export const isMeal = (meal: OpenAIResponse): boolean => {
  if (meal === null || meal === undefined) return false;
  if (typeof meal === "string") return false;

  if (typeof meal === "object" && "message" in meal && "data" in meal) {
    return true;
  }
  return false;
};

export const hasMeals = (user: IUserWithLastMeal | IUserWithMeals): boolean => {
  return Array.isArray((user as IUserWithMeals).meals) && (user as IUserWithMeals).meals.length > 0;
};
