import logger from "../../../../../shared/config/logger";
import {
  refundConfirmed,
  refundRejectedByUser,
} from "../../../../../shared/libs/commands/refund";
import { updateMealRequested } from "../../../../../shared/libs/commands/update-meal";
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

    const buttonReplyId = button_reply.id.split("__")[0] as ButtonReplyEnum;
    const attachedContext = button_reply.id.split("__")[1];

    switch (buttonReplyId) {
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
      case ButtonReplyEnum.UpdateMeal: {
        Logger("buttonReply").info("UpdateMeal");
        await updateMealRequested(user, attachedContext);
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
