import * as _ from "lodash";
import { USER_MESSAGES } from "../../../../shared/config/config";
import logger from "../../../../shared/config/logger";
import SettingsSingleton from "../../../../shared/config/settings";
import { IUser } from "../../../../shared/models/user.model";
import * as messageService from "../../../../shared/services/message.service";
import * as openAIService from "../../../../shared/services/openAI.service";
import * as userMealService from "../../../../shared/services/userMeal.service";
import {
  MessageTypesEnum,
  OpenAIMessageTypesEnum,
} from "../../../../shared/types/enums";
import { WhastappWebhookObject } from "../../../../shared/types/message";
import { WhatsappData } from "../../../../shared/utils/WhatsappData";
import { convertToHumanReadableMessage } from "../../../../shared/utils/string";
import {
  getInstructionForUser,
  getUserLocalTime,
} from "../../../../shared/utils/user";

const Logger = logger("lib/whatsapp/textMessage");

export const processTextMessage = async (
  payload: WhastappWebhookObject,
  user: IUser
) => {
  Logger("processTextMessage").info("");
  const { userMessage } = new WhatsappData(payload);
  const settings = await SettingsSingleton.getInstance();
  const assistantId = settings.get(
    "openai.assistant.mealpoints-core"
  ) as string;

  try {
    try {
      const result = await openAIService.ask(userMessage as string, user, {
        messageType: OpenAIMessageTypesEnum.Text,
        assistantId,
        additionalInstructions: await getInstructionForUser(user),
      });

      const message = _.isObject(result) ? result.message : result;

      // Store meal if mealData is present
      if (_.isObject(result) && result.data?.meal_name) {
        const data = result.data;
        await userMealService.createUserMeal({
          user: user.id,
          name: data.meal_name,
          score: data.score,
          macros: data.macros,
          localTime: getUserLocalTime(user),
        });
      }

      await messageService.sendTextMessage({
        user: user.id,
        payload: convertToHumanReadableMessage(message),
        type: MessageTypesEnum.Text,
      });
    } catch (error) {
      await messageService.sendTextMessage({
        user: user.id,
        payload: USER_MESSAGES.errors.text_not_processed,
        type: MessageTypesEnum.Text,
      });
      Logger("processTextMessage").error(error);
      throw error;
    }

    return;
  } catch (error) {
    Logger("processTextMessage").error(error);
    throw error;
  }
};
