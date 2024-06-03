import { WebhookObject } from "../../types/message";
import { IUser } from "../../models/user.model";

export const processDocumentMessage = (payload: WebhookObject, user: IUser) => {
  console.debug(
    "[whatsapp.documentMessage/processDocumentMessage]: Processing document message",
    payload
  );
  return;
};
