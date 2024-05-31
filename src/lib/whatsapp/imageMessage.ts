import { IWhatsappWebhookPayload } from "../../types/message";

export const processImageMessage = (payload: IWhatsappWebhookPayload) => {
  console.debug("whatsapp.webhook: Processing image message", payload);
  return;
};
