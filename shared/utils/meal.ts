import { OpenAIResponse } from "../types/openai";
import {
  IUsersToSendReminders,
  IUsersToSendSummaries,
} from "../types/queueMessages";

export const isMeal = (meal: OpenAIResponse): boolean => {
  if (meal === null || meal === undefined) return false;
  if (typeof meal === "string") return false;

  if (typeof meal === "object" && "message" in meal && "data" in meal) {
    return true;
  }
  return false;
};

export const hasMeals = (
  user: IUsersToSendReminders | IUsersToSendSummaries
): boolean => {
  return (
    Array.isArray((user as IUsersToSendSummaries).meals) &&
    (user as IUsersToSendSummaries).meals.length > 0
  );
};
