import logger from "../../config/logger";
import { WebhookObject } from "../../types/message";
const Logger = logger("lib/whatsapp/audioMessage");

export const processAudioMessage = (payload: WebhookObject) => {
  Logger("processAudioMessage").debug(payload);

  return;
};
