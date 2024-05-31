import { IWhatsappWebhookPayload } from "../../types/message";
import { IUser } from "../../models/user.model";

export const processAudioMessage = (
  payload: IWhatsappWebhookPayload,
  user: IUser
) => {
  console.debug("whatsapp.webhook: Processing audio message", payload);
  return;
};
