import { IUser } from "../../models/user.model";
import { WebhookTypesEnum } from "../../types/enums";
import { IWhatsappWebhookPayload } from "../../types/message";
import { processAudioMessage } from "./audioMessage";
import { processDocumentMessage } from "./documentMessage";
import { processImageMessage } from "./imageMessage";
import { processInteractiveMessage } from "./interactiveMessage";
import { processStickerMessage } from "./stickerMessage";
import { processTextMessage } from "./textMessage";
import { processUnknownMessage } from "./unknownMessage";
import { processVideoMessage } from "./videoMessage";
import * as messageService from "../../services/message.service";

export const categoriseWebhook = (
  payload: IWhatsappWebhookPayload
): WebhookTypesEnum => {
  switch (payload.entry[0].changes[0].value.messages[0].type) {
    case WebhookTypesEnum.Text:
      return WebhookTypesEnum.Text;
    case WebhookTypesEnum.Audio:
      return WebhookTypesEnum.Audio;
    case WebhookTypesEnum.Document:
      return WebhookTypesEnum.Document;
    case WebhookTypesEnum.Image:
      return WebhookTypesEnum.Image;
    case WebhookTypesEnum.Interactive:
      return WebhookTypesEnum.Interactive;
    case WebhookTypesEnum.Sticker:
      return WebhookTypesEnum.Sticker;
    case WebhookTypesEnum.Video:
      return WebhookTypesEnum.Video;
    default:
      return WebhookTypesEnum.Unknown;
  }
};

export const processMessage = async (
  payload: IWhatsappWebhookPayload,
  user: IUser
) => {
  const webhookType = categoriseWebhook(payload);
  console.debug("whatsapp.webhook: Processing message type: ", webhookType);

  await messageService.createMessage({ user: user.id, message: payload });

  switch (webhookType) {
    case WebhookTypesEnum.Text:
      return processTextMessage(payload);
    case WebhookTypesEnum.Audio:
      return processAudioMessage(payload);
    case WebhookTypesEnum.Document:
      return processDocumentMessage(payload);
    case WebhookTypesEnum.Image:
      return processImageMessage(payload);
    case WebhookTypesEnum.Interactive:
      return processInteractiveMessage(payload);
    case WebhookTypesEnum.Sticker:
      return processStickerMessage(payload);
    case WebhookTypesEnum.Video:
      return processVideoMessage(payload);
    default:
      return processUnknownMessage(payload);
  }
};
