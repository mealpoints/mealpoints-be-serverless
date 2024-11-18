import logger from "../../../../shared/config/logger";
import { WhastappWebhookObject } from "../../../../shared/types/message";
import { WhatsappData } from "../../../../shared/utils/WhatsappData";
import { processInboundMessageWebhook } from "./inboundMessages";
import { processStatusUpdateWebhook } from "./statusUpdates";
const Logger = logger("lib/whatsapp/processWhatsappWebhook");

export const processWhatsappWebhook = async (
  payload: WhastappWebhookObject
) => {
  Logger("processWhatsappWebhook").info("");

  try {
    const whatsappData = new WhatsappData(payload);
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
