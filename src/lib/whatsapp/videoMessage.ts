import logger from "../../config/logger";
import { WebhookObject } from "../../types/message";
const Logger = logger("lib/whatsapp/interactiveMessage");
export const processVideoMessage = (payload: WebhookObject) => {
  Logger("processVideoMessage").debug(payload);
  return;
};
