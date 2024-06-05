import logger from "../../config/logger";
import * as messageService from "../../services/message.service";
import { WebhookObject } from "../../types/message";
const Logger = logger("lib/whatsapp/statusUpdates");

export const processStatusUpdateWebhook = async (payload: WebhookObject) => {
  Logger("processStatusUpdateWebhook").debug("");

  const { id, status } = payload.entry[0].changes[0].value.statuses[0];

  try {
    await messageService.updateSentMessageStatusByWAID(id, status);
  } catch (error) {
    Logger("processStatusUpdateWebhook").error(error);
    throw error;
  }
  return;
};
