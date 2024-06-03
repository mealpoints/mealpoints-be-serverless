import { IConversation } from "../../models/conversation.model";
import { IUser } from "../../models/user.model";
import * as messageService from "../../services/message.service";
import { MessageTypesEnum } from "../../types/enums";
import { WebhookObject } from "../../types/message";

export const processTextMessage = async (
  payload: WebhookObject,
  user: IUser,
  conversation: IConversation
) => {
  console.debug("[whatsapp.textMessage/processTextMessage]");
  const message: string = payload.entry[0].changes[0].value.messages[0].text
    ?.body as string;

  try {
    const whatsappMessageResponse = await messageService.sendMessage({
      user: user.id,
      conversation: conversation.id,
      payload: `Thank you for your message. We are processing your request:

      ${message}`,
      type: MessageTypesEnum.Text,
    });
    return whatsappMessageResponse;
  } catch (error) {
    console.error(
      "[whatsapp.textMessage/processTextMessage]: Error processing message",
      error
    );
    throw error;
  }
};
