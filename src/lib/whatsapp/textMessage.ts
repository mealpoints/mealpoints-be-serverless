import logger from "../../config/logger";
import { IConversation } from "../../models/conversation.model";
import { IUser } from "../../models/user.model";
import * as messageService from "../../services/message.service";
import * as openaiService from "../../services/openai.service";
import { MessageTypesEnum, OpenAIMessageTypesEnum } from "../../types/enums";
import { WebhookObject } from "../../types/message";
const Logger = logger("lib/whatsapp/interactiveMessage");

export const processTextMessage = async (
  payload: WebhookObject,
  user: IUser,
  conversation: IConversation
) => {
  Logger("processTextMessage").debug("");
  const userMessage: string = payload.entry[0].changes[0].value.messages?.[0]
    .text?.body as string;

  try {
    try {
      const result = await openaiService.ask(userMessage, user, conversation, {
        messageType: OpenAIMessageTypesEnum.Text,
      });
      await messageService.sendMessage({
        user: user.id,
        conversation: conversation.id,
        payload: result,
        type: MessageTypesEnum.Text,
      });
    } catch (error) {
      await messageService.sendMessage({
        user: user.id,
        conversation: conversation.id,
        payload: "Sorry, I am unable to process your request at the moment.",
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
