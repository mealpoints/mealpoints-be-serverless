import { Request, Response } from "express";
import * as userMealService from "../../../shared/services/userMeal.service";
import ApiResponse from "../../../shared/utils/ApiResponse";

export const getUserMealsByUserId = async (
  request: Request,
  response: Response
) => {
  const userId = request.params.id;
  const userMeals = await userMealService.getUserMealsByUserId(userId);
  return ApiResponse.Ok(response, userMeals);
};
