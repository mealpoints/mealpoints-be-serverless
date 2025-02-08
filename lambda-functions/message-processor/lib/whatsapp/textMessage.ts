import { USER_MESSAGES } from "../../../../shared/config/config";
import logger from "../../../../shared/config/logger";
import SettingsSingleton from "../../../../shared/config/settings";
import { doesMessageContainCommand } from "../../../../shared/libs/commands";
import { processUserMeal } from "../../../../shared/libs/userMeals";
import { IUser } from "../../../../shared/models/user.model";
import * as messageService from "../../../../shared/services/message.service";
import * as openAIService from "../../../../shared/services/openAI.service";
import {
  MessageTypesEnum,
  OpenAIMessageTypesEnum,
} from "../../../../shared/types/enums";
import { WhastappWebhookObject } from "../../../../shared/types/message";
import { MealResponse } from "../../../../shared/types/openai";
import { WhatsappData } from "../../../../shared/utils/WhatsappData";
import { getOpenAiInstructions } from "../../../../shared/utils/openai";
import { convertToHumanReadableMessage } from "../../../../shared/utils/string";

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
      // Check if user has entered a command
      if (await doesMessageContainCommand(userMessage as string, user)) return;

      const result = (await openAIService.ask(userMessage as string, user, {
        messageType: OpenAIMessageTypesEnum.Text,
        assistantId,
        additionalInstructions: await getOpenAiInstructions({ user }),
      })) as MealResponse;

      if (result.type === "food") {
        await processUserMeal({
          user: user,
          openAIMealresponse: result,
        });
      } else {
        await messageService.sendTextMessage({
          user: user.id,
          payload: convertToHumanReadableMessage(result.nonFoodMessage),
          type: MessageTypesEnum.Text,
        });
      }
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
