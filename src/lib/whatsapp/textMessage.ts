import { IConversation } from "../../models/conversation.model";
import { IUser } from "../../models/user.model";
import { IWhatsappWebhookPayload } from "../../types/message";
import * as messageService from "../../services/message.service";
import { MessageTypesEnum } from "../../types/enums";

export const processTextMessage = async (
  payload: IWhatsappWebhookPayload,
  user: IUser,
  conversation: IConversation
) => {
  console.debug(
    "[whatsapp.textMessage/processTextMessage]: Processing text message",
    payload
  );

  try {
    const whatsappMessageResponse = await messageService.sendMessage({
      user: user.id,
      conversation: conversation.id,
      payload:
        "Hello, I am a bot. I am currently learning how to respond to messages. Please be patient with me.",
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
