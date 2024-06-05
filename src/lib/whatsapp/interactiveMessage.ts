import logger from "../../config/logger";
import { WebhookObject } from "../../types/message";
const Logger = logger("lib/whatsapp/interactiveMessage");

export const processInteractiveMessage = (payload: WebhookObject) => {
  Logger("processInteractiveMessage").debug(payload);
  return;
};
