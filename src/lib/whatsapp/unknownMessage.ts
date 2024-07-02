import logger from "../../config/logger";
import { IConversation } from "../../models/conversation.model";
import { IUser } from "../../models/user.model";
import * as messageService from "../../services/message.service";
import { MessageTypesEnum } from "../../types/enums";
import { WebhookObject } from "../../types/message";
const Logger = logger("lib/whatsapp/interactiveMessage");

export const processUnknownMessage = async (
  payload: WebhookObject,
  user: IUser,
  conversation: IConversation
) => {
  Logger("processUnknownMessage").debug(payload);
  await messageService.sendMessage({
    user: user.id,
    conversation: conversation.id,
    payload:
      "Sorry, we only accept food photos and text messages at the moment. The format of the message you sent is not supported. Please stay tuned for further updates.",
    type: MessageTypesEnum.Text,
  });
  return;
};
