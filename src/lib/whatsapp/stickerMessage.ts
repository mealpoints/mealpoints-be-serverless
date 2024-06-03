import { WebhookObject } from "../../types/message";

export const processStickerMessage = (payload: WebhookObject) => {
  console.debug(
    "[whatsapp.stickerMessage/processStickerMessage]: Processing sticker message",
    payload
  );
  return;
};
