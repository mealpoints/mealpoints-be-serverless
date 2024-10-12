import { USER_MESSAGES } from "../../../../shared/config/config";
import logger from "../../../../shared/config/logger";
import { IConversation } from "../../../../shared/models/conversation.model";
import { IUser } from "../../../../shared/models/user.model";
import * as messageService from "../../../../shared/services/message.service";
import { MessageTypesEnum } from "../../../../shared/types/enums";
import { WhastappWebhookObject } from "../../../../shared/types/message";
const Logger = logger("lib/whatsapp/unknownMessage");

export const processUnknownMessage = async (
  payload: WhastappWebhookObject,
  user: IUser,
  conversation: IConversation
) => {
  Logger("processUnknownMessage").info(payload);
  await messageService.sendTextMessage({
    user: user.id,
    conversation: conversation.id,
    payload: USER_MESSAGES.info.feature_not_supported,
    type: MessageTypesEnum.Text,
  });
  return;
};
