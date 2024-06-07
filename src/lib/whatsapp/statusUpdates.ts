import logger from "../../config/logger";
import * as messageService from "../../services/message.service";
import { StatusEnum } from "../../types/enums";
import { WebhookObject } from "../../types/message";
const Logger = logger("lib/whatsapp/statusUpdates");

export const processStatusUpdateWebhook = async (payload: WebhookObject) => {
  Logger("processStatusUpdateWebhook").debug("");

  const { statuses } = payload.entry[0].changes[0].value;
  const status = statuses?.[0].status as StatusEnum;
  const id = statuses?.[0].id as string;

  try {
    await messageService.updateSentMessageStatusByWAID(id, status);
  } catch (error) {
    Logger("processStatusUpdateWebhook").error(error);
    throw error;
  }
  return;
};
