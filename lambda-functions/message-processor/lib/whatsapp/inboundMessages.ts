import logger from "../../../../shared/config/logger";
import * as conversationService from "../../../../shared/services/conversation.service";
import * as messageService from "../../../../shared/services/message.service";
import * as userService from "../../../../shared/services/user.service";
import { WebhookTypesEnum } from "../../../../shared/types/enums";
import { WebhookObject } from "../../../../shared/types/message";
import { processImageMessage } from "./imageMessage";
import { processTextMessage } from "./textMessage";
import { processUnknownMessage } from "./unknownMessage";
const Logger = logger("lib/whatsapp/inboundMessages");

export const categoriseInboundMessageWebhook = (
  payload: WebhookObject
): WebhookTypesEnum => {
  switch (payload.entry[0].changes[0].value.messages?.[0].type) {
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
  Logger("processInboundMessageWebhook").debug(webhookType);

  const contact = payload.entry[0].changes[0].value.messages?.[0]
    .from as string;
  const wamid = payload.entry[0].changes[0].value.messages?.[0].id as string;

  // Ensure user exists
  const user = await userService.ensureUserByContact(contact);

  // Ensure conversation exists
  const conversation = await conversationService.ensureConversation(user.id);

  const existingMessage = await messageService.findRecievedMessage({ wamid });

  if (existingMessage.length > 0) {
    // TODO: Sometimes the same message is sent twice,
    // this usually happens because the first time the message was processed unccesdfully
    Logger("processInboundMessageWebhook").debug(
      "This message was already processed earlier"
    );
    return;
  }

  // Create message
  await messageService.createRecievedMessage({
    user: user.id,
    payload,
    type: webhookType,
    conversation: conversation.id,
    wamid: payload.entry[0].changes[0].value.messages?.[0].id as string,
  });

  switch (webhookType) {
    case WebhookTypesEnum.Text: {
      return processTextMessage(payload, user, conversation);
    }

    case WebhookTypesEnum.Image: {
      return processImageMessage(payload, user, conversation);
    }

    default: {
      return processUnknownMessage(payload, user, conversation);
    }
  }
};
