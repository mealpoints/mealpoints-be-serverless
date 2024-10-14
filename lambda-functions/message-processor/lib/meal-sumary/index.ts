import logger from "../../../../shared/config/logger";
import SettingsSingleton from "../../../../shared/config/settings";
import * as messageService from "../../../../shared/services/message.service";
import * as openAIService from "../../../../shared/services/openAI.service";
import { MessageTypesEnum, OpenAIMessageTypesEnum } from "../../../../shared/types/enums";
import { IUserWithMeals } from "../../../../shared/types/queueMessages";
import { convertToHumanReadableMessage } from "../../../../shared/utils/string";

const Logger = logger("lib/reminder/meal-summary");

export const processMealSummary = async (messageBody: IUserWithMeals) => {
  Logger("processMealSummary").info(``);

  /**
   *  1. Extract the message body from the event
   *  2. OpenAI.ask to envoke model which generates summary by giving the user.meals
   *  3. send the response to User via Meta service & store the response in userEngagementMessage schema
   *  4. return
   */

  const settings = await SettingsSingleton.getInstance();
  const assistantId = settings.get(
    "openai.assistant.meal-summary"
  ) as string;
  const stringifiedMeals = JSON.stringify(messageBody.meals);
  const user = messageBody.user;

  try {
    const result = await openAIService.ask(stringifiedMeals, user, {
      messageType: OpenAIMessageTypesEnum.Text,
      assistantId,
    })

    await messageService.sendTextMessage({
      user: user.id,
      payload: convertToHumanReadableMessage(result.message),
      type: MessageTypesEnum.Text,
    })
    // TODO: SAVE ENGAGMENT MESSAGE INTO db, userEngagementMessage SERVICES NEEDS TO BE IMPLEMENTED FIRST

    return;
  } catch (error) {
    Logger("processMealSummary").error(error);
    throw error;
  }
};
