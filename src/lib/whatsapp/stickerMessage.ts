import { IUser } from "../../models/user.model";
import { IWhatsappWebhookPayload } from "../../types/message";

export const processStickerMessage = async (
  payload: IWhatsappWebhookPayload,
  user: IUser
) => {
  console.debug(
    "[whatsapp.stickerMessage/processStickerMessage]: Processing sticker message",
    payload
  );
  return;
};
