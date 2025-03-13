import { FilterQuery } from "mongoose";
import { START_HOUR_OF_DAY } from "../config/config";
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
    Logger("createUserMeal").info("");
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
    Logger("getUserMealsByUserId").info("");
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
    Logger("getPeriodicUserMealsByUserId").info("");
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
    Logger("getUserMealById").info("");
    const userMeal = await UserMeal.findById(id);

    return userMeal;
  } catch (error) {
    Logger("getUserMealById").error(error);
    throw error;
  }
};

export const getTodaysUserMealsByUserId = async (
  userId: string
): Promise<IUserMeal[]> => {
  try {
    Logger("getTodaysUserMealsByUserId").info("");
    const now = new Date();
    const localStartTime = new Date(
      Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        START_HOUR_OF_DAY,
        0,
        0
      )
    );

    const userMeals = await UserMeal.find({
      user: userId,
      localTime: { $gte: localStartTime },
    });
    return userMeals;
  } catch (error) {
    Logger("getTodaysUserMealsByUserId").error(error);
    throw error;
  }
};

export const findUserMeals = async (filter: FilterQuery<IUserMeal>) => {
  Logger("findUserMeals").info(`called with`);
  try {
    const userMeals = await UserMeal.find(filter);
    return userMeals;
  } catch (error) {
    Logger("findUserMeals").error(error);
    throw error;
  }
};

export const getUsersWhoHaveLoggedMealsInPeriod = async (
  startDate: Date,
  endDate: Date
): Promise<string[]> => {
  try {
    Logger("getUsersWhoHaveLoggedMealsInPeriod").info("");
    const users = await UserMeal.distinct("user", {
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });
    return users;
  } catch (error) {
    Logger("getUsersWhoHaveLoggedMealsInPeriod").error(error);
    throw error;
  }
};

export const find = async (filter: FilterQuery<IUserMeal>) => {
  Logger("find").info(`called with ${JSON.stringify(filter)}`);
  try {
    const userMeals = await UserMeal.find(filter);
    return userMeals;
  } catch (error) {
    Logger("find").error(error);
    throw error;
  }
};

export const getUserMealsInPeriod = async (
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<IUserMeal[]> => {
  try {
    Logger("getUserMealsInPeriod").info("");
    const userMeals = await UserMeal.find({
      user: userId,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });
    return userMeals;
  } catch (error) {
    Logger("getUserMealsInPeriod").error(error);
    throw error;
  }
};

export const deleteUserMealById = async (id: string) => {
  try {
    Logger("deleteUserMealById").info("");
    await UserMeal.findByIdAndDelete(id);
  } catch (error) {
    Logger("deleteUserMealById").error(JSON.stringify(error));
    throw error;
  }
};
