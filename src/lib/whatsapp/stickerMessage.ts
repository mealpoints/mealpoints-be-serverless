import { IUser } from "../../models/user.model";
import { WebhookObject } from "../../types/message";

export const processStickerMessage = async (
  payload: WebhookObject,
  user: IUser
) => {
  console.debug(
    "[whatsapp.stickerMessage/processStickerMessage]: Processing sticker message",
    payload
  );
  return;
};
