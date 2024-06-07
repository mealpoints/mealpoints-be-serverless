import logger from "../../config/logger";
import * as openAiHandler from "../../handlers/openAi.handler";
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
    const openAiResponse = await openAiHandler.sendQuery();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const joke = openAiResponse.data.attachments[0].text;

    const whatsappMessageResponse = await messageService.sendMessage({
      user: user.id,
      conversation: conversation.id,
      payload: `Thank you for your message: "${userMessage}"

While I figure out how to respond to your queries, here's a joke for you: 
${joke}`,
      type: MessageTypesEnum.Text,
    });
    return whatsappMessageResponse;
  } catch (error) {
    Logger("processTextMessage").error(error);
    throw error;
  }
};
