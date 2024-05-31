import { IWhatsappWebhookPayload } from "../../types/message";

export const processUnknownMessage = (payload: IWhatsappWebhookPayload) => {
  console.debug("whatsapp.webhook: Processing unknown message", payload);
  return;
};
