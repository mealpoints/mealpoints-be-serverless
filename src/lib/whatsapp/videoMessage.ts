import { IWhatsappWebhookPayload } from "../../types/message";
import { IUser } from "../../models/user.model";

export const processVideoMessage = (
  payload: IWhatsappWebhookPayload,
  user: IUser
) => {
  console.debug(
    "[whatsapp.videoMessage/processVideoMessage]: Processing video message",
    payload
  );
  return;
};
