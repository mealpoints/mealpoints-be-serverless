import { WebhookObject } from "../../types/message";
import { IUser } from "../../models/user.model";

export const processAudioMessage = (payload: WebhookObject, user: IUser) => {
  console.debug(
    "[whatsapp.audioMessage/processAudioMessage]: Processing audio message",
    payload
  );
  return;
};
