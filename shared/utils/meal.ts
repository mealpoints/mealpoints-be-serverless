import { OpenAIResponse } from "../types/openai";

export const isMeal = (meal: OpenAIResponse): boolean => {
  if (meal === null || meal === undefined) return false;
  if (typeof meal === "string") return false;

  if (typeof meal === "object" && "message" in meal && "data" in meal) {
    return true;
  }
  return false;
};
