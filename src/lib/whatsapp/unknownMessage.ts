import { WebhookObject } from "../../types/message";

export const processUnknownMessage = (payload: WebhookObject) => {
  console.debug(
    "[whatsapp.unknownMessage/processUnknownMessage]: Processing unknown message",
    payload
  );
  return;
};
