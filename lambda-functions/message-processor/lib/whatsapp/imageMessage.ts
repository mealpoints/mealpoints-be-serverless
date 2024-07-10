import fs from "node:fs";
import { USER_MESSAGES } from "../../../../shared/config/config";
import logger from "../../../../shared/config/logger";
import * as awsHandler from "../../../../shared/handlers/aws.handler";
import * as whatsappHandler from "../../../../shared/handlers/whatsapp.handler";
import { IConversation } from "../../../../shared/models/conversation.model";
import { IUser } from "../../../../shared/models/user.model";
import * as messageService from "../../../../shared/services/message.service";
import * as openAIService from "../../../../shared/services/openAI.service";
import {
  MessageTypesEnum,
  OpenAIMessageTypesEnum,
} from "../../../../shared/types/enums";
import { WebhookObject } from "../../../../shared/types/message";
const Logger = logger("lib/whatsapp/imageMessage");

export const processImageMessage = async (
  payload: WebhookObject,
  user: IUser,
  conversation: IConversation
) => {
  Logger("processImageMessage").debug("");

  try {
    const imageId = extractImageId(payload);
    const imageFilePath = await fetchImage(imageId);
    const s3Path = await uploadImageToS3(user.id, imageId, imageFilePath);

    try {
      const openaiResponse = await openAIService.ask(
        s3Path,
        user,
        conversation,
        { messageType: OpenAIMessageTypesEnum.Image }
      );
      cleanupLocalFile(imageFilePath);
      await updateReceivedMessage(payload, s3Path);

      return await sendMessageToWhatsApp(
        user.id,
        conversation.id,
        openaiResponse
      );
    } catch (error) {
      await handleOpenAIUploadError(user.id, conversation.id, error);
      throw error;
    }
  } catch (error) {
    Logger("processImageMessage").error(error);
    throw error;
  }
};

const extractImageId = (payload: WebhookObject): string => {
  return payload.entry[0].changes[0].value.messages?.[0].image?.id as string;
};

const fetchImage = async (imageId: string): Promise<string> => {
  return await whatsappHandler.getImageSentViaMessage(imageId);
};

const uploadImageToS3 = async (
  userId: string,
  imageId: string,
  imageFilePath: string
): Promise<string> => {
  return await awsHandler.uploadImageToS3(
    `${userId}/${imageId}.jpg`,
    imageFilePath
  );
};

const cleanupLocalFile = (filePath: string) => {
  fs.unlink(filePath, (error) => {
    if (error) {
      Logger("cleanupLocalFile").error(
        `Failed to delete local file: ${filePath}`,
        error
      );
    } else {
      Logger("cleanupLocalFile").debug(
        `Successfully deleted local file: ${filePath}`
      );
    }
  });
};

const updateReceivedMessage = async (
  payload: WebhookObject,
  s3Path: string
): Promise<void> => {
  await messageService.updateRecievedMessage(
    {
      wamid: payload.entry[0].changes[0].value.messages?.[0].id,
    },
    {
      media: s3Path,
    }
  );
};

const sendMessageToWhatsApp = async (
  userId: string,
  conversationId: string,
  openaiResponse: string
) => {
  return await messageService.sendMessage({
    user: userId,
    conversation: conversationId,
    payload: openaiResponse,
    type: MessageTypesEnum.Text,
  });
};

const handleOpenAIUploadError = async (
  userId: string,
  conversationId: string,
  error: unknown
): Promise<void> => {
  Logger("openaiHandler.uploadImage").error(error);
  await messageService.sendMessage({
    user: userId,
    conversation: conversationId,
    payload: USER_MESSAGES.errors.image_not_processed,
    type: MessageTypesEnum.Text,
  });
  throw new Error("OpenAI upload image failed");
};
