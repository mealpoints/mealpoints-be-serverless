import { IUser } from "../../models/user.model";
import { IWhatsappWebhookPayload } from "../../types/message";

export const processTextMessage = (
  payload: IWhatsappWebhookPayload,
  user: IUser
) => {
  console.debug("whatsapp.webhook: Processing text message", payload);
  return;
};
