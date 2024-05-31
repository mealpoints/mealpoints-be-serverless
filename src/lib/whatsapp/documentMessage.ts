import { IWhatsappWebhookPayload } from "../../types/message";

export const processDocumentMessage = (payload: IWhatsappWebhookPayload) => {
  console.debug("whatsapp.webhook: Processing document message", payload);
  return;
};
