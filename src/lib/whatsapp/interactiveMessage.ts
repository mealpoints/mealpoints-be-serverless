import { IWhatsappWebhookPayload } from "../../types/message";

export const processInteractiveMessage = (payload: IWhatsappWebhookPayload) => {
  console.debug("whatsapp.webhook: Processing interactive message", payload);
  return;
};
