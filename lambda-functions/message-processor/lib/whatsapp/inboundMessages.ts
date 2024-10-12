import logger from "../../../../shared/config/logger";
import * as conversationService from "../../../../shared/services/conversation.service";
import * as messageService from "../../../../shared/services/message.service";
import * as userService from "../../../../shared/services/user.service";
import { WebhookTypesEnum } from "../../../../shared/types/enums";
import { WhastappWebhookObject } from "../../../../shared/types/message";
import { WhatsappData } from "../../../../shared/utils/WhatsappData";
import { isUserRateLimited } from "../rate-limiter";
import { processImageMessage } from "./imageMessage";
import { processTextMessage } from "./textMessage";
import { processUnknownMessage } from "./unknownMessage";

const Logger = logger("lib/whatsapp/inboundMessages");

export const processInboundMessageWebhook = async (
  payload: WhastappWebhookObject
) => {
  try {
    const { webhookType, contact, whatsappMessageId } = new WhatsappData(
      payload
    );

    Logger("processInboundMessageWebhook").info(webhookType);

    // Ensure user exists
    const user = await userService.ensureUserByContact(contact as string);

    // Ensure conversation exists
    const conversation = await conversationService.ensureConversation(user.id);

    const existingMessage = await messageService.findRecievedMessage({
      whatsappMessageId,
    });

    if (existingMessage.length > 0) {
      // Sometimes the same message is sent twice, this usually happens because the first time the message was processed unccesdfully
      Logger("processInboundMessageWebhook").info(
        "This message was already processed earlier"
      );
      return;
    }

    // Ensure user had not exceeded the limit of messages per day
    if (await isUserRateLimited(user, conversation)) return;

    // Create message
    await messageService.createRecievedMessage({
      user: user.id,
      payload,
      type: webhookType,
      conversation: conversation.id,
      wamid: whatsappMessageId as string,
    });

    switch (webhookType) {
      case WebhookTypesEnum.Text: {
        return processTextMessage(payload, user, conversation);
      }

      case WebhookTypesEnum.Image: {
        return processImageMessage(payload, user, conversation);
      }

      default: {
        return processUnknownMessage(payload, user, conversation);
      }
    }
  } catch (error) {
    Logger("processInboundMessageWebhook").error(error);
    throw error;
  }
};
