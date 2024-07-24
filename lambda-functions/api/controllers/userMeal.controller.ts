import { Request, Response } from "express";
import * as userMealService from "../../../shared/services/userMeal.service";
import ApiResponse from "../../../shared/utils/ApiResponse";
import { extractPaginationOptions } from "../../../shared/utils/pagination";

export const getUserMealsByUserId = async (
  request: Request,
  response: Response
) => {
  const userId = request.params.id;
  const options = extractPaginationOptions(request.query);

  const userMeals = await userMealService.getUserMealsByUserId(userId, options);
  return ApiResponse.Ok<typeof userMeals>(response, userMeals);
};
