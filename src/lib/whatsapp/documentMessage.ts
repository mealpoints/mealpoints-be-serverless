import logger from "../../config/logger";
import { WebhookObject } from "../../types/message";
const Logger = logger("lib/whatsapp/documentMessage");

export const processDocumentMessage = (payload: WebhookObject) => {
  Logger("processDocumentMessage").debug(payload);
  return;
};
