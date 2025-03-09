import logger from "../../../config/logger";
import { IUser } from "../../../models/user.model";
import * as userMealService from "../../../services/userMeal.service";
import * as messageService from "../../../services/message.service";
import { updateDailyNutritionTrackerWithMeal } from "../../dailyNutritionTracker";
import { MessageTypesEnum } from "../../../types/enums";
import { USER_MESSAGES } from "../../../config/config";
import { sendInternalAlert } from "../../internal-alerts";
const Logger = logger("shared/libs/commands/update-meal");

export const updateMealRequested = async (user: IUser, meal: string) => {
  Logger("updateMealRequested").info("");
  try {
    const userMeal = await userMealService.getUserMealById(meal);
    if (!userMeal) {
      Logger("updateMealRequested").info("User meal not found");
      throw new Error("User meal not found");
    }

    await updateDailyNutritionTrackerWithMeal({
      user: user.id,
      macros: userMeal.macros,
      operation: "subtract",
    });

    await userMealService.deleteUserMealById(meal);

    await messageService.sendTextMessage({
      user: user.id,
      type: MessageTypesEnum.Text,
      payload: USER_MESSAGES.info.meal.updated,
    })
  } catch (error) {
    Logger("updateMealRequested").error(JSON.stringify(error));
    
    await messageService.sendTextMessage({
      user: user.id,
      type: MessageTypesEnum.Text,
      payload: USER_MESSAGES.info.meal.not_updated,
    })

    await sendInternalAlert({
      message: `Failed to fulfill update meal request for user ${user.id}`,
      severity: "minor",
    });

    throw error;
  }
};
