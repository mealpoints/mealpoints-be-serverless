import { IConversation } from "../../models/conversation.model";
import { IUser } from "../../models/user.model";
import * as messageService from "../../services/message.service";
import { MessageTypesEnum } from "../../types/enums";
import { WebhookObject } from "../../types/message";

export const processImageMessage = async (
  payload: WebhookObject,
  user: IUser,
  conversation: IConversation
) => {
  console.debug("[whatsapp.imageMessage/processImageMessage]");
  try {
    const whatsappMessageResponse = await messageService.sendMessage({
      user: user.id,
      conversation: conversation.id,
      payload: `This is stuff about the image message.`,
      type: MessageTypesEnum.Text,
    });
    return whatsappMessageResponse;
  } catch (error) {
    console.error(
      "[whatsapp.textMessage/processImageMessage]: Error processing message",
      error
    );
    throw error;
  }
};
