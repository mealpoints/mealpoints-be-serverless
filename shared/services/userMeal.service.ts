import logger from "../config/logger";
import UserMeal, { IUserMeal, IUserMealCreate } from "../models/userMeal.model";
const Logger = logger("userMeal.service");

export const createUserMeal = async (
  userMeal: IUserMealCreate
): Promise<IUserMeal> => {
  try {
    Logger("createUserMeal").debug("");
    const newUserMeal = await UserMeal.create(userMeal);
    return newUserMeal;
  } catch (error) {
    Logger("createUserMeal").error(error);
    throw error;
  }
};

export const getUserMealsByUserId = async (
  userId: string
): Promise<IUserMeal[]> => {
  try {
    Logger("getUserMealsByUserId").debug("");
    const userMeals = await UserMeal.find({ user: userId });
    return userMeals;
  } catch (error) {
    Logger("getUserMealsByUserId").error(error);
    throw error;
  }
};

export const getUserMealById = async (
  id: string
): Promise<IUserMeal | null> => {
  try {
    Logger("getUserMealById").debug("");
    const userMeal = await UserMeal.findById(id);

    return userMeal;
  } catch (error) {
    Logger("getUserMealById").error(error);
    throw error;
  }
};
