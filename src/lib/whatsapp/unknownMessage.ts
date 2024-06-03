import { WebhookObject } from "../../types/message";
import { IUser } from "../../models/user.model";

export const processUnknownMessage = (payload: WebhookObject, user: IUser) => {
  console.debug(
    "[whatsapp.unknownMessage/processUnknownMessage]: Processing unknown message",
    payload
  );
  return;
};
