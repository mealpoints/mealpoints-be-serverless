import logger from "../../../../../shared/config/logger";
import {
  refundConfirmed,
  refundRejectedByUser,
} from "../../../../../shared/libs/commands/refund";
import { IUser } from "../../../../../shared/models/user.model";
import { ButtonReplyEnum } from "../../../../../shared/types/enums";
import {
  ButtonReplyObject,
  WhastappWebhookObject,
} from "../../../../../shared/types/message";
import { WhatsappData } from "../../../../../shared/utils/WhatsappData";
import { processUnknownMessage } from "../unknownMessage";

const Logger = logger("lib/whatsapp/interactiveMessage/buttonReply");

export const buttonReply = async (
  payload: WhastappWebhookObject,
  user: IUser
) => {
  Logger("buttonReply").info("");
  try {
    const { interactiveMessageContent } = new WhatsappData(payload);
    const { button_reply } = interactiveMessageContent as ButtonReplyObject;

    switch (button_reply.id) {
      case ButtonReplyEnum.RefundConfirmed: {
        Logger("buttonReply").info("RefundConfirmed");
        await refundConfirmed(user);
        break;
      }
      case ButtonReplyEnum.RefundRejected: {
        Logger("buttonReply").info("RefundRejected");
        await refundRejectedByUser(user);
        break;
      }
      default: {
        Logger("buttonReply").info("default");
        await processUnknownMessage(payload, user);
        break;
      }
    }
  } catch (error) {
    Logger("buttonReply").error(JSON.stringify(error));
    throw error;
  }
};
