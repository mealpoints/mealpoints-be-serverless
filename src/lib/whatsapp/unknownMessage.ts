import logger from "../../config/logger";
import { WebhookObject } from "../../types/message";
const Logger = logger("lib/whatsapp/interactiveMessage");
export const processUnknownMessage = (payload: WebhookObject) => {
  Logger("processUnknownMessage").debug(payload);
  return;
};
