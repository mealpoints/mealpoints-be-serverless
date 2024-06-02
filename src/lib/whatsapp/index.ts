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
import * as userService from "../../services/user.service";

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

export const processMessage = async (payload: IWhatsappWebhookPayload) => {
  const webhookType = categoriseWebhook(payload);
  console.debug("whatsapp.webhook: Processing message type: ", webhookType);

  const contact = payload.entry[0].changes[0].value.messages[0].from;
  // See if user with contact exists, if not create one
  let user = null;
  user = await userService.getUserByContact(contact);
  if (!user) {
    user = await userService.createUser({ contact });
  }

  await messageService.createMessage({ user: user.id, payload });

  switch (webhookType) {
    case WebhookTypesEnum.Text:
      return processTextMessage(payload, user as IUser);
    case WebhookTypesEnum.Audio:
      return processAudioMessage(payload, user as IUser);
    case WebhookTypesEnum.Document:
      return processDocumentMessage(payload, user as IUser);
    case WebhookTypesEnum.Image:
      return processImageMessage(payload, user as IUser);
    case WebhookTypesEnum.Interactive:
      return processInteractiveMessage(payload, user as IUser);
    case WebhookTypesEnum.Sticker:
      return processStickerMessage(payload, user as IUser);
    case WebhookTypesEnum.Video:
      return processVideoMessage(payload, user as IUser);
    default:
      return processUnknownMessage(payload, user as IUser);
  }
};
