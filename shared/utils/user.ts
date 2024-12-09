import logger from "../config/logger";
import { IUser } from "../models/user.model";
import { getTodaysUserMealsByUserId } from "../services/userMeal.service";
import { CountryCodeToNameEnum } from "../types/enums";
import { getGlocalInstruction } from "./openai";
import { getLocaleTimeInTimezone, getTimeInTimezone } from "./timezone";
const Logger = logger("shared/utils/user");

export const getUserLocalTime = (user: IUser): Date => {
  Logger("getUserLocalTime").info("");
  const { timezone } = user;
  return getTimeInTimezone(new Date(), timezone);
};

const timeAndLocationOfUser = (user: IUser) => {
  const countryName =
    CountryCodeToNameEnum[
      user.countryCode as keyof typeof CountryCodeToNameEnum
    ];
  
  const localDateTime = getLocaleTimeInTimezone(new Date(), user.timezone);
  
  return `The user is from ${countryName}, and it's ${localDateTime} in ${countryName} right now. `;
};

const todaysMealsByUser = async (user: IUser): Promise<string> => {
  try {
    const userMeals = await getTodaysUserMealsByUserId(user.id);
    const mealDetails = userMeals.map((userMeal) => {
      const mealTime = getLocaleTimeInTimezone(userMeal.createdAt, user.timezone, 'time');
      return `${userMeal.name} at ${mealTime}`;
    });
    if (mealDetails.length === 0) {
      return "";
    }
    return `The user has consumed the following meals today: ${mealDetails.join(", ")}`;
  } catch (error) {
    Logger("todaysMealsByUser").error(error);
    return "";
  }
};

export const getInstructionForUser = async (user: IUser): Promise<string> => {
  return timeAndLocationOfUser(user) + await todaysMealsByUser(user) + await getGlocalInstruction();
};
