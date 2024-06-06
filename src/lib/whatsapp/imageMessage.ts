import logger from "../../config/logger";
import * as awsHandler from "../../handlers/aws.handler";
import * as whatsappHandler from "../../handlers/whatsapp.handler";
import { IConversation } from "../../models/conversation.model";
import { IUser } from "../../models/user.model";
import * as messageService from "../../services/message.service";
import { MessageTypesEnum } from "../../types/enums";
import { WebhookObject } from "../../types/message";
const Logger = logger("lib/whatsapp/imageMessage");

export const processImageMessage = async (
  payload: WebhookObject,
  user: IUser,
  conversation: IConversation
) => {
  Logger("processImageMessage").debug("");
  try {
    const imageId = payload.entry[0].changes[0].value.messages[0].image
      ?.id as string;
    const imageFilePath = await whatsappHandler.getImageSentViaMessage(imageId);

    const s3Path = await awsHandler.uploadImageToS3(
      `${user.id}/${imageId}`,
      imageFilePath
    );

    await messageService.updateRecievedMessage(
      {
        wamid: payload.entry[0].changes[0].value.messages[0].id,
      },
      {
        media: s3Path,
      }
    );

    const whatsappMessageResponse = await messageService.sendMessage({
      user: user.id,
      conversation: conversation.id,
      payload: `This is stuff about the image message.`,
      type: MessageTypesEnum.Text,
    });

    return whatsappMessageResponse;
  } catch (error) {
    Logger("processImageMessage").error(error);
    throw error;
  }
};
