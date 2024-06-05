import logger from "../config/logger";
import * as whatsappHandler from "../handlers/whatsapp.handler";
import RecievedMessage, {
  IRecievedMessage,
  IRecievedMessageCreate,
} from "../models/recievedMessage.model";
import SentMessage, {
  ISentMessage,
  ISentMessageCreate,
} from "../models/sentMessage.model";
import { StatusEnum } from "../types/enums";
import * as userService from "./user.service";
const Logger = logger("message.service");

export const createRecievedMessage = async (
  messageData: IRecievedMessageCreate
): Promise<IRecievedMessage> => {
  Logger("createRecievedMessage").debug("");
  const message = await RecievedMessage.create(messageData);
  return message;
};

export const createSentMessage = async (
  messageData: ISentMessageCreate
): Promise<ISentMessage> => {
  try {
    Logger("createSentMessage").debug("");
    const message = await SentMessage.create(messageData);
    return message;
  } catch (error) {
    Logger("createSentMessage").error(error);
    throw error;
  }
};

export const updateSentMessageStatusByWAID = async (
  wamid: string,
  status: StatusEnum
): Promise<ISentMessage> => {
  try {
    Logger("updateSentMessageStatusByWAID").debug("");
    const sentMessage = await SentMessage.findOneAndUpdate(
      { wamid },
      { status },
      { new: true }
    );

    if (!sentMessage) {
      throw new Error("Sent message not found");
    }

    return sentMessage;
  } catch (error) {
    Logger("updateSentMessageStatusByWAID").error(error);
    throw error;
  }
};

export const updateSentMessageStatus = async (
  messageId: string,
  status: StatusEnum
): Promise<ISentMessage> => {
  try {
    Logger("updateSentMessageStatus").debug("");
    const sentMessage = await SentMessage.findByIdAndUpdate(
      messageId,
      { status },
      { new: true }
    );

    if (!sentMessage) {
      throw new Error("Sent message not found");
    }

    return sentMessage;
  } catch (error) {
    Logger("updateSentMessageStatus").error(error);
    throw error;
  }
};

export const sendMessage = async (messageData: ISentMessageCreate) => {
  Logger("sendMessage").debug("");
  try {
    const user = await userService.getUserById(messageData.user);
    if (!user) {
      throw new Error("User not found");
    }

    // Send Message via Whatsapp
    const response = await whatsappHandler
      .sendMessage(user.contact, messageData.payload)
      .catch(async (error) => {
        await updateSentMessageStatus(sentMessage.id, StatusEnum.Failed);
        Logger("sendMessage").error(error);
        throw error;
      });

    // Store Sent Message
    const sentMessage = await createSentMessage({
      ...messageData,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
      wamid: response.data.messages[0].id,
    });

    return response;
  } catch (error) {
    Logger("sendMessage").error(error);
    throw error;
  }
};
