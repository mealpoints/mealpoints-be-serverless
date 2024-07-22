import logger from "../config/logger";
import UserMeal, { IUserMeal, IUserMealCreate } from "../models/userMeal.model";
import { ReportPeriod } from "../types/report";
import { DateUtils } from "../utils/DateUtils";
import { PaginateOptions, PaginateResult } from "../utils/mongoosePlugins";
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
  userId: string,
  options: PaginateOptions
): Promise<PaginateResult<IUserMeal>> => {
  try {
    Logger("getUserMealsByUserId").debug("");
    const userMeals = await UserMeal.paginate({ user: userId }, options);
    return userMeals;
  } catch (error) {
    Logger("getUserMealsByUserId").error(error);
    throw error;
  }
};

export const getPeriodicUserMealsByUserId = async (
  userId: string,
  period: ReportPeriod
): Promise<IUserMeal[]> => {
  const subtractionPeriod = () => {
    switch (period) {
      case "daily": {
        return new DateUtils().subtractDays(1).toDate();
      }
      case "weekly": {
        return new DateUtils().subtractWeeks(1).toDate();
      }
      case "monthly": {
        return new DateUtils().subtractMonths(1).toDate();
      }
    }
  };

  try {
    Logger("getPeriodicUserMealsByUserId").debug("");
    const userMeals = await UserMeal.find({
      user: userId,
      createdAt: { $gte: subtractionPeriod() },
    });
    return userMeals;
  } catch (error) {
    Logger("getPeriodicUserMealsByUserId").error(error);
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
