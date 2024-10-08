import logger from "../../../../shared/config/logger";
import * as messageService from "../../../../shared/services/message.service";
import { StatusEnum } from "../../../../shared/types/enums";
import { WebhookObject } from "../../../../shared/types/message";
const Logger = logger("lib/whatsapp/statusUpdates");

export const processStatusUpdateWebhook = async (payload: WebhookObject) => {
  Logger("processStatusUpdateWebhook").info("");

  const { statuses } = payload.entry[0].changes[0].value;
  const status = statuses?.[0].status as StatusEnum;
  const id = statuses?.[0].id as string;

  try {
    await messageService.updateSentMessageStatusByWAID(id, status);
  } catch (error) {
    Logger("processStatusUpdateWebhook").error(error);
  }
  return;
};
