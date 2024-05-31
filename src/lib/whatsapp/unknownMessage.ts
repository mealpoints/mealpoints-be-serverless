import { IWhatsappWebhookPayload } from "../../types/message";
import { IUser } from "../../models/user.model";

export const processUnknownMessage = (
  payload: IWhatsappWebhookPayload,
  user: IUser
) => {
  console.debug("whatsapp.webhook: Processing unknown message", payload);
  return;
};
