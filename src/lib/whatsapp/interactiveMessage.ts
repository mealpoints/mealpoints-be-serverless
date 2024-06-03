import { WebhookObject } from "../../types/message";

export const processInteractiveMessage = (payload: WebhookObject) => {
  console.debug(
    "[whatsapp.interactiveMessage/processInteractiveMessage]: Processing interactive message",
    payload
  );
  return;
};
