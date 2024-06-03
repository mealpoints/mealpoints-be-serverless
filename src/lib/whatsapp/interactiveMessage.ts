import { IWhatsappWebhookPayload } from "../../types/message";
import { IUser } from "../../models/user.model";

export const processInteractiveMessage = (
  payload: IWhatsappWebhookPayload,
  user: IUser
) => {
  console.debug(
    "[whatsapp.interactiveMessage/processInteractiveMessage]: Processing interactive message",
    payload
  );
  return;
};
