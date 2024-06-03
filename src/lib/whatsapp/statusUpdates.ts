import { IWhatsappWebhookPayload } from "../../types/message";
import * as messageService from "../../services/message.service";

export const processStatusUpdateWebhook = async (
  payload: IWhatsappWebhookPayload
) => {
  console.debug(
    "[whatsapp.statusUpdates/processStatusUpdateWebhook]: Processing status update",
    JSON.stringify(payload)
  );

  // Process status update
  const { id, status } = payload.entry[0].changes[0].value.statuses[0];

  try {
    // Update message status
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
