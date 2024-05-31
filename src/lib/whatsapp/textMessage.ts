import { IWhatsappWebhookPayload } from "../../types/message";

export const processTextMessage = (payload: IWhatsappWebhookPayload) => {
  console.debug("whatsapp.webhook: Processing text message", payload);
  return;
};
