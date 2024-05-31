import { IWhatsappWebhookPayload } from "../../types/message";
import { IUser } from "../../models/user.model";

export const processVideoMessage = (
  payload: IWhatsappWebhookPayload,
  user: IUser
) => {
  console.debug("whatsapp.webhook: Processing video message", payload);
  return;
};
