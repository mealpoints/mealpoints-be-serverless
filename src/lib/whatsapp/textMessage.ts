import logger from "../../config/logger";
import * as openAiHandler from "../../handlers/openai.handler";
import { IConversation } from "../../models/conversation.model";
import { IUser } from "../../models/user.model";
import * as messageService from "../../services/message.service";
import { MessageTypesEnum } from "../../types/enums";
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
    const openAiResponse = await openAiHandler.generateChat(userMessage);
    const whatsappMessageResponse = await messageService.sendMessage({
      user: user.id,
      conversation: conversation.id,
      payload: openAiResponse,
      type: MessageTypesEnum.Text,
    });
    return whatsappMessageResponse;
  } catch (error) {
    Logger("processTextMessage").error(error);
    throw error;
  }
};
