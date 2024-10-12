import logger from "../../../../shared/config/logger";
import { WebhookObject } from "../../../../shared/types/message";
import { WhatsappData } from "../../../../shared/utils/WhatsappData";
import { processInboundMessageWebhook } from "./inboundMessages";
import { processStatusUpdateWebhook } from "./statusUpdates";
const Logger = logger("lib/whatsapp/processWhatsappWebhook");

export const processWhatsappWebhook = async (payload: WebhookObject) => {
  Logger("processWhatsappWebhook").info("");
  const whatsappData = new WhatsappData(payload);

  try {
    if (whatsappData.isInboundMessage) {
      return processInboundMessageWebhook(payload);
    } else if (whatsappData.isStatusUpdate) {
      return processStatusUpdateWebhook(payload);
    }
  } catch (error) {
    Logger("processWhatsappWebhook").error(error);
    return;
  }
};
