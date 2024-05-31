import { IWhatsappWebhookPayload } from "../../types/message";
export const processAudioMessage = (payload: IWhatsappWebhookPayload) => {
  console.debug("whatsapp.webhook: Processing audio message", payload);
  return;
};
