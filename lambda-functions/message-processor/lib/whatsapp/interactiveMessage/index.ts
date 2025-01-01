import { USER_MESSAGES } from "../../../../../shared/config/config";
import logger from "../../../../../shared/config/logger";
import { IUser } from "../../../../../shared/models/user.model";
import * as messageService from "../../../../../shared/services/message.service";
import { MessageTypesEnum } from "../../../../../shared/types/enums";
import { WhastappWebhookObject } from "../../../../../shared/types/message";
import { WhatsappData } from "../../../../../shared/utils/WhatsappData";
import { processUnknownMessage } from "../unknownMessage";
import { buttonReply } from "./buttonReply";

const Logger = logger("lib/whatsapp/interactiveMessage");

export const processInteractiveMessage = async (
  payload: WhastappWebhookObject,
  user: IUser
) => {
  Logger("processInteractiveMessage").info("");
  try {
    const { interactiveMessageContent } = new WhatsappData(payload);

    switch (interactiveMessageContent?.type) {
      case "button_reply": {
        await buttonReply(payload, user);
        return;
      }
      default: {
        Logger("processInteractiveMessage").info(
          "Unknown interactive message type"
        );
        await processUnknownMessage(payload, user);
        return;
      }
    }
  } catch (error) {
    Logger("processInteractiveMessage").error(JSON.stringify(error));
    await messageService.sendTextMessage({
      user: user.id,
      payload: USER_MESSAGES.errors.text_not_processed,
      type: MessageTypesEnum.Text,
    });
    throw error;
  }
};
