import logger from "../../config/logger";
import { IUser } from "../../models/user.model";
import { IUserMealCreate } from "../../models/userMeal.model";
import * as messageService from "../../services/message.service";
import * as userMealService from "../../services/userMeal.service";
import { MessageTypesEnum } from "../../types/enums";
import { IOpenAIMealResponse } from "../../types/openai";
import { getUserLocalTime } from "../../utils/user";
import { updateDailyNutritionTrackerWithMeal } from "../dailyNutritionTracker";
import { formatMessage } from "./utils";

const Logger = logger("libs/userMeals");

export const createUserMeal = async (data: IUserMealCreate) => {
  try {
    Logger("createUserMeal").info("");
    const userMeal = await userMealService.createUserMeal(data);
    return userMeal;
  } catch (error) {
    Logger("createUserMeal").error(error);
    throw error;
  }
};

interface IProcessUserMeal {
  user: IUser;
  openAIMealresponse: IOpenAIMealResponse;
  image?: string;
}

export const processUserMeal = async (properties: IProcessUserMeal) => {
  Logger("processUserMeal").info("");

  const { openAIMealresponse, user } = properties;
  const { data, message } = openAIMealresponse;

  if (!data) {
    Logger("processUserMeal").error("No data found in openai response");
    throw new Error("No data found in openai response");
  }

  try {
    const userMeal = await createUserMeal({
      user: user.id,
      name: data.meal_name,
      score: data.score,
      macros: data.macros,
      localTime: getUserLocalTime(user),
      image: properties.image,
    });

    const dailyNutritionTracker = await updateDailyNutritionTrackerWithMeal({
      user: user.id,
      calories: data.macros.calories.value,
      protein: data.macros.protein.value,
      fat: data.macros.fat.value,
      carbohydrates: data.macros.carbohydrates.value,
    });

    await messageService.sendTextMessage({
      user: user.id,
      payload: formatMessage(message, dailyNutritionTracker),
      type: MessageTypesEnum.Text,
    });

    return userMeal;
  } catch (error) {
    Logger("processUserMeal").error(error);
    throw error;
  }
};
