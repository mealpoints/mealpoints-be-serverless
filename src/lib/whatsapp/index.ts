import { WebhookObject } from "../../types/message";
import { processInboundMessageWebhook } from "./inboundMessages";
import { processStatusUpdateWebhook } from "./statusUpdates";

export const processWebhook = async (payload: WebhookObject) => {
  console.debug(
    "[whatsapp/processWebhook]: Processing webhook",
    JSON.stringify(payload)
  );

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
    console.error("[whatsapp/processWebhook]: Error:", error);
  }
};
