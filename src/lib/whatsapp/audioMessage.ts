import { WebhookObject } from "../../types/message";

export const processAudioMessage = (payload: WebhookObject) => {
  console.debug(
    "[whatsapp.audioMessage/processAudioMessage]: Processing audio message",
    payload
  );
  return;
};
