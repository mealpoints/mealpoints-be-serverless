import { USER_MESSAGES } from "../../../config/config";
import logger from "../../../config/logger";
import { IUser } from "../../../models/user.model";
import * as messageService from "../../../services/message.service";
import { ButtonReplyEnum, MessageTypesEnum } from "../../../types/enums";

const Logger = logger("shared/libs/commands/refund");

export const confirmRefund = async (user: IUser) => {
  Logger("confirmRefund").info("");
  await messageService.sendInteractiveMessage({
    user: user.id,
    type: MessageTypesEnum.Interactive,
    interactive: {
      type: "button",
      body: {
        text: USER_MESSAGES.info.refund.confirmation,
      },
      action: {
        buttons: [
          {
            type: "reply",
            reply: {
              id: ButtonReplyEnum.RefundConfirmed,
              title: "Yes",
            },
          },
          {
            type: "reply",
            reply: {
              id: ButtonReplyEnum.RefundRejected,
              title: "No",
            },
          },
        ],
      },
    },
  });
};

export const refundRejectedByUserMessage = async (user: IUser) => {
  Logger("refundRejected").info("");
  await messageService.sendTextMessage({
    user: user.id,
    type: MessageTypesEnum.Text,
    payload: USER_MESSAGES.info.refund.rejected_by_user,
  });
};

export const refundProcessed = async (user: IUser) => {
  Logger("refundProcessed").info("");
  await messageService.sendTextMessage({
    user: user.id,
    type: MessageTypesEnum.Text,
    payload: USER_MESSAGES.info.refund.processed,
  });
};
