import logger from "../../config/logger";
import { WebhookObject } from "../../types/message";
const Logger = logger("lib/whatsapp/interactiveMessage");
export const processStickerMessage = (payload: WebhookObject) => {
  Logger("processStickerMessage").debug(payload);
  return;
};
