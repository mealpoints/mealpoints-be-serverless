import { WebhookObject } from "../../types/message";
import { IUser } from "../../models/user.model";

export const processVideoMessage = (payload: WebhookObject, user: IUser) => {
  console.debug(
    "[whatsapp.videoMessage/processVideoMessage]: Processing video message",
    payload
  );
  return;
};
