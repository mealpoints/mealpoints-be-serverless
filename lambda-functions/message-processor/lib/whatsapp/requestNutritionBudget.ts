import logger from "../../../../shared/config/logger";
import { IUser } from "../../../../shared/models/user.model";
import * as messageService from "../../../../shared/services/message.service";
import { MessageTypesEnum } from "../../../../shared/types/enums";

const Logger = logger("lib/whatsapp/requestNutritionBudget");

export const requestNutritionBudget = async (user: IUser) => {
  Logger("requestNutritionBudget").info("");

  // TODO: Implement a Flow to set up a nutrition budget
  // Temporarily send a message to the user to contact us to set up a nutrition budget
  // Later we will send a Flow to the user to set up a nutrition budget
  await messageService.sendTextMessage({
    user: user.id,
    payload:
      "Looks like you don't have a nutrition budget set up yet. Please setup your nutrition budget first by contacting us at mealpoints.coach@gmail.com.",
    type: MessageTypesEnum.Text,
  });
};
