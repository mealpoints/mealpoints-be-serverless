import { WebhookObject } from "../../types/message";
import { IUser } from "../../models/user.model";

export const processInteractiveMessage = (
  payload: WebhookObject,
  user: IUser
) => {
  console.debug(
    "[whatsapp.interactiveMessage/processInteractiveMessage]: Processing interactive message",
    payload
  );
  return;
};
