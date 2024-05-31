import { IWhatsappWebhookPayload } from "../../types/message";

export const processStickerMessage = async (
  message: IWhatsappWebhookPayload
) => {
  console.debug("whatsapp.webhook: Processing sticker message", message);
  return;
};
