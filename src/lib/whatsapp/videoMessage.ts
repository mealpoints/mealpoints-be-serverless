import { WebhookObject } from "../../types/message";

export const processVideoMessage = (payload: WebhookObject) => {
  console.debug(
    "[whatsapp.videoMessage/processVideoMessage]: Processing video message",
    payload
  );
  return;
};
