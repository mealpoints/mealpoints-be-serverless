import { WebhookObject } from "../../types/message";

export const processDocumentMessage = (payload: WebhookObject) => {
  console.debug(
    "[whatsapp.documentMessage/processDocumentMessage]: Processing document message",
    payload
  );
  return;
};
