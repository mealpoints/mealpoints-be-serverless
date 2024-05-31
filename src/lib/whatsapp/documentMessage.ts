import { IWhatsappWebhookPayload } from "../../types/message";
import { IUser } from "../../models/user.model";

export const processDocumentMessage = (
  payload: IWhatsappWebhookPayload,
  user: IUser
) => {
  console.debug("whatsapp.webhook: Processing document message", payload);
  return;
};
