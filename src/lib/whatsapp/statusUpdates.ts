import * as messageService from "../../services/message.service";
import { WebhookObject } from "../../types/message";

export const processStatusUpdateWebhook = async (payload: WebhookObject) => {
  console.debug(
    "[whatsapp.statusUpdates/processStatusUpdateWebhook]: Processing status update"
  );

  const { id, status } = payload.entry[0].changes[0].value.statuses[0];

  try {
    await messageService.updateSentMessageStatusByWAID(id, status);
  } catch (error) {
    console.error(
      "[whatsapp.statusUpdates/processStatusUpdateWebhook]: Error processing status update",
      error
    );
    throw error;
  }
  return;
};
