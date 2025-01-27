import logger from "../../config/logger";
import { IUser } from "../../models/user.model";
import * as messageService from "../../services/message.service";
import * as userMealService from "../../services/userMeal.service";
import { MessageTypesEnum } from "../../types/enums";
import { Food } from "../../types/openai";
import { getUserLocalTime } from "../../utils/user";
import { updateDailyNutritionTrackerWithMeal } from "../dailyNutritionTracker";
import { formatMessage } from "./utils";

const Logger = logger("libs/userMeals");

interface IProcessUserMeal {
  user: IUser;
  openAIMealresponse: Food;
  image?: string;
}

export const processUserMeal = async (properties: IProcessUserMeal) => {
  Logger("processUserMeal").info("");

  const { openAIMealresponse, user } = properties;
  const { meal } = openAIMealresponse;

  try {
    const userMeal = await userMealService.createUserMeal({
      user: user.id,
      name: meal.name,
      score: meal.score,
      macros: meal.macros,
      localTime: getUserLocalTime(user),
      image: properties.image,
    });

    const dailyNutritionTracker = await updateDailyNutritionTrackerWithMeal({
      user: user.id,
      macros: meal.macros,
    });

    await messageService.sendTextMessage({
      user: user.id,
      payload: formatMessage(openAIMealresponse, dailyNutritionTracker),
      type: MessageTypesEnum.Text,
    });

    return userMeal;
  } catch (error) {
    Logger("processUserMeal").error(error);
    throw error;
  }
};
