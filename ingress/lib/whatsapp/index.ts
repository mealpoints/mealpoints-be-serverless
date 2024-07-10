import logger from "../../../shared/config/logger";
import { WebhookObject } from "../../../shared/types/message";
import { processInboundMessageWebhook } from "./inboundMessages";
import { processStatusUpdateWebhook } from "./statusUpdates";
const Logger = logger("lib/whatsapp/processWebhook");

export const processWebhook = async (payload: WebhookObject) => {
  Logger("processWebhook").debug("");

  try {
    // Identify if the webhook is a message or a status update
    const isInboundMessage = !!payload.entry[0].changes[0].value.messages;
    const isStatusUpdate = !!payload.entry[0].changes[0].value.statuses;
    if (isInboundMessage) {
      return processInboundMessageWebhook(payload);
    } else if (isStatusUpdate) {
      return processStatusUpdateWebhook(payload);
    }
  } catch (error) {
    Logger("processWebhook").error(error);
    return;
  }
};
