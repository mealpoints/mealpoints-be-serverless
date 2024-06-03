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
import * as conversationService from "../../services/conversation.service";
import { IUser } from "../../models/user.model";
import { WebhookTypesEnum } from "../../types/enums";
import { WebhookObject } from "../../types/message";

export const categoriseInboundMessageWebhook = (
  payload: WebhookObject
): WebhookTypesEnum => {
  switch (payload.entry[0].changes[0].value.messages[0].type) {
    case WebhookTypesEnum.Text: {
      return WebhookTypesEnum.Text;
    }
    case WebhookTypesEnum.Audio: {
      return WebhookTypesEnum.Audio;
    }
    case WebhookTypesEnum.Document: {
      return WebhookTypesEnum.Document;
    }
    case WebhookTypesEnum.Image: {
      return WebhookTypesEnum.Image;
    }
    case WebhookTypesEnum.Interactive: {
      return WebhookTypesEnum.Interactive;
    }
    case WebhookTypesEnum.Sticker: {
      return WebhookTypesEnum.Sticker;
    }
    case WebhookTypesEnum.Video: {
      return WebhookTypesEnum.Video;
    }
    default: {
      return WebhookTypesEnum.Unknown;
    }
  }
};

export const processInboundMessageWebhook = async (payload: WebhookObject) => {
  const webhookType = categoriseInboundMessageWebhook(payload);

  console.debug(
    "[whatsapp.inboundMessages/processInboundMessageWebhook]: Processing message type:",
    webhookType
  );

  const contact = payload.entry[0].changes[0].value.messages[0].from;

  // Ensure user exists
  // TODO: TEMP FIX
  const user = await userService.ensureUserByContact("+" + contact);

  // Ensure conversation exists
  const conversation = await conversationService.ensureConversation(user.id);

  // Create message
  await messageService.createRecievedMessage({
    user: user.id,
    payload,
    type: webhookType,
    conversation: conversation.id,
  });

  switch (webhookType) {
    case WebhookTypesEnum.Text: {
      return processTextMessage(payload, user, conversation);
    }
    case WebhookTypesEnum.Audio: {
      return processAudioMessage(payload, user);
    }
    case WebhookTypesEnum.Document: {
      return processDocumentMessage(payload, user);
    }
    case WebhookTypesEnum.Image: {
      return processImageMessage(payload, user);
    }
    case WebhookTypesEnum.Interactive: {
      return processInteractiveMessage(payload, user);
    }
    case WebhookTypesEnum.Sticker: {
      return processStickerMessage(payload, user);
    }
    case WebhookTypesEnum.Video: {
      return processVideoMessage(payload, user);
    }
    default: {
      return processUnknownMessage(payload, user);
    }
  }
};
