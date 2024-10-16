import logger from "../../../../shared/config/logger";
import SettingsSingleton from "../../../../shared/config/settings";
import * as messageService from "../../../../shared/services/message.service";
import * as openAIService from "../../../../shared/services/openAI.service";
import * as userEngagementMessageService from "../../../../shared/services/userEngagement.service";
import { MessageTypesEnum, OpenAIMessageTypesEnum, userEngagementMessageTypesEnum } from "../../../../shared/types/enums";
import { IUserWithLastMeal } from "../../../../shared/types/queueMessages";
import { convertToHumanReadableMessage } from "../../../../shared/utils/string";

const Logger = logger("lib/reminder/logger");

export const processReminder = async (messageBody: IUserWithLastMeal) => {
  Logger("processReminder").info(`Starting processReminder`);

  /**
 *  1. Extract the message body from the event
 *  2. OpenAI.ask to envoke model which generates reminder msg by giving the user.meals
 *  3. send the response to User via Meta service & store the response in userEngagementMessage schema
 *  4. return
 */

  const settings = await SettingsSingleton.getInstance();
  const assistantId = settings.get(
    "openai.assistant.reminder"
  ) as string;
  const stringifiedMeals = JSON.stringify(messageBody.lastMeal);
  const user = messageBody.user;

  try {
    const result = await openAIService.ask(stringifiedMeals, user, {
      messageType: OpenAIMessageTypesEnum.Text,
      assistantId,
    })

    const textMessageResponse = await messageService.sendTextMessage({
      user: user.id,
      payload: convertToHumanReadableMessage(result.message),
      type: MessageTypesEnum.Text,
    })

    // Todo: Check Response Success
    if (textMessageResponse) {
      await userEngagementMessageService.createUserEngagementMessage({
        user: user.id,
        content: result.message,
        type: userEngagementMessageTypesEnum.Summary
      })
    }

    return;
  } catch (error) {
    Logger("processReminder").error(error);
  }
};
