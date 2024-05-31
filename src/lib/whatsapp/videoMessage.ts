import { IWhatsappWebhookPayload } from "../../types/message";

export const processVideoMessage = (payload: IWhatsappWebhookPayload) => {
  console.debug("whatsapp.webhook: Processing video message", payload);
  return;
};
