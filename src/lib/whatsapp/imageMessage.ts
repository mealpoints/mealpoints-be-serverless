import { WebhookObject } from "../../types/message";

export const processImageMessage = (payload: WebhookObject) => {
  console.debug(
    "[whatsapp.imageMessage/processImageMessage]: Processing image message",
    payload
  );
  return;
};
