import fs from "node:fs";
import { USER_MESSAGES } from "../../../../shared/config/config";
import logger from "../../../../shared/config/logger";
import SettingsSingleton from "../../../../shared/config/settings";
import * as awsHandler from "../../../../shared/handlers/aws.handler";
import * as whatsappHandler from "../../../../shared/handlers/whatsapp.handler";
import { IUser } from "../../../../shared/models/user.model";
import * as messageService from "../../../../shared/services/message.service";
import * as openAIService from "../../../../shared/services/openAI.service";
import * as userMealService from "../../../../shared/services/userMeal.service";
import {
  MessageTypesEnum,
  OpenAIMessageTypesEnum,
} from "../../../../shared/types/enums";
import { WhastappWebhookObject } from "../../../../shared/types/message";
import { MealData } from "../../../../shared/types/openai";
import { WhatsappData } from "../../../../shared/utils/WhatsappData";
import { convertToHumanReadableMessage } from "../../../../shared/utils/string";
const Logger = logger("lib/whatsapp/imageMessage");

export const processImageMessage = async (
  payload: WhastappWebhookObject,
  user: IUser
) => {
  Logger("processImageMessage").info("");
  const { imageId } = new WhatsappData(payload);

  const settings = await SettingsSingleton.getInstance();
  const assistantId = settings.get(
    "openai.assistant.mealpoints-core"
  ) as string;

  try {
    const imageFilePath = await fetchImage(imageId as string);
    const s3Path = await uploadImageToS3(
      user.id,
      imageId as string,
      imageFilePath
    );

    const prompt = JSON.stringify({
      image_path: s3Path,
      usersCountry: user.countryCode,
      usersLocaltimestamp: user.localDateTime,
    })

    try {
      const openaiResponse = await openAIService.ask(prompt, user, {
        messageType: OpenAIMessageTypesEnum.Image,
        assistantId,
      });
      cleanupLocalFile(imageFilePath);
      await updateReceivedMessage(payload, s3Path);
      await messageService.sendTextMessage({
        user: user.id,
        payload: convertToHumanReadableMessage(openaiResponse.message),
        type: MessageTypesEnum.Text,
      });
      if (openaiResponse.data?.meal_name) {
        await storeMeal(user, s3Path, openaiResponse.data);
      }
    } catch (error) {
      await messageService.sendTextMessage({
        user: user.id,
        payload: USER_MESSAGES.errors.image_not_processed,
        type: MessageTypesEnum.Text,
      });
      throw error;
    }
  } catch (error) {
    Logger("processImageMessage").error(error);
    throw error;
  }
};

const fetchImage = async (imageId: string): Promise<string> => {
  return await whatsappHandler.getImageSentViaMessage(imageId);
};

const storeMeal = async (user: IUser, s3Path: string, data: MealData) => {
  await userMealService.createUserMeal({
    user: user.id,
    image: s3Path,
    name: data.meal_name,
    score: data.score,
    macros: data.macros,
    localTime: user.localDateTime,
  });
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
      Logger("cleanupLocalFile").info(
        `Successfully deleted local file: ${filePath}`
      );
    }
  });
};

const updateReceivedMessage = async (
  payload: WhastappWebhookObject,
  s3Path: string
): Promise<void> => {
  const { whatsappMessageId } = new WhatsappData(payload);
  await messageService.updateRecievedMessage(
    {
      wamid: whatsappMessageId as string,
    },
    {
      media: s3Path,
    }
  );
};

const handleOpenAIUploadError = async (
  userId: string,
  error: unknown
): Promise<void> => {
  Logger("openaiHandler.uploadImage").error(error);

  throw new Error("OpenAI upload image failed");
};
