import { WebhookObject } from "../../types/message";
import { IUser } from "../../models/user.model";

export const processImageMessage = (payload: WebhookObject, user: IUser) => {
  console.debug(
    "[whatsapp.imageMessage/processImageMessage]: Processing image message",
    payload
  );
  return;
};
