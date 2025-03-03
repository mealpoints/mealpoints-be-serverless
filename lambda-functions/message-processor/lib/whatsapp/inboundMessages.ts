import { analyticsClient } from "../../../../shared/config/analytics";
import logger from "../../../../shared/config/logger";
import { isUserSubscribed } from "../../../../shared/libs/subscription";
import * as messageService from "../../../../shared/services/message.service";
import * as nutritionBudgetService from "../../../../shared/services/nutritionBudget.service";
import * as userService from "../../../../shared/services/user.service";
import { WebhookTypesEnum } from "../../../../shared/types/enums";
import { WhastappWebhookObject } from "../../../../shared/types/message";
import { WhatsappData } from "../../../../shared/utils/WhatsappData";
import { isUserRateLimited } from "../rate-limiter";
import { processImageMessage } from "./imageMessage";
import { processInteractiveMessage } from "./interactiveMessage";
import { handleNonSubscribedUser } from "./nonSubscribedUser";
import { requestNutritionBudget } from "./requestNutritionBudget";
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

    analyticsClient.capture({
      distinctId: user.id,
      event: "inbound_message",
      properties: {
        type: webhookType,
        ...payload,
      },
    });

    // Subs check paywall
    const { isSubscribed, subscription } = await isUserSubscribed(user);
    if (!isSubscribed) {
      return handleNonSubscribedUser(user, subscription);
    }

    // Make sure User's Nutrition Budget is exists
    if (
      !(await nutritionBudgetService.getNutritionBudgetByUser(user.id)) &&
      webhookType !== WebhookTypesEnum.Interactive // This is to make sure that the when the user creates a budget via the interactive message, the user is not stopped (stuck in a loop)
    ) {
      // At this point, user's current msg is left unprocessed
      return await requestNutritionBudget(user);
    }

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

    // Create message
    await messageService.createRecievedMessage({
      user: user.id,
      payload,
      type: webhookType,
      wamid: whatsappMessageId as string,
    });

    // Ensure user had not exceeded the limit of messages per day
    if (await isUserRateLimited(user)) return;

    switch (webhookType) {
      case WebhookTypesEnum.Text: {
        return processTextMessage(payload, user);
      }

      case WebhookTypesEnum.Image: {
        return processImageMessage(payload, user);
      }

      case WebhookTypesEnum.Interactive: {
        return processInteractiveMessage(payload, user);
      }

      default: {
        return processUnknownMessage(payload, user);
      }
    }
  } catch (error) {
    Logger("processInboundMessageWebhook").error(error);
    throw error;
  }
};
