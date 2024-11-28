import { FilterQuery, UpdateQuery } from "mongoose";
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
import { ComponentTypesEnum, StatusEnum } from "../types/enums";
import {
  InteractiveMessageBodyOptions,
  MessageTemplateObject,
} from "../types/message";
import * as userService from "./user.service";
const Logger = logger("message.service");

export const createRecievedMessage = async (
  messageData: IRecievedMessageCreate
): Promise<IRecievedMessage> => {
  Logger("createRecievedMessage").info("");

  // If messag with same wamid already exists, return the existing message
  const existingMessage = await RecievedMessage.findOne({
    wamid: messageData.wamid,
  });
  if (existingMessage) {
    Logger("createRecievedMessage").info(
      "Message already exists. Not saving it"
    );

    return existingMessage;
  }

  // Create new message
  const message = await RecievedMessage.create(messageData);
  return message;
};

export const updateSentMessageStatusByWAID = async (
  wamid: string,
  status: StatusEnum
): Promise<ISentMessage> => {
  try {
    Logger("updateSentMessageStatusByWAID").info("");
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
    Logger("updateSentMessageStatus").info("");
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

export const findRecievedMessage = async (
  filter: FilterQuery<IRecievedMessage>
): Promise<IRecievedMessage[] | []> => {
  try {
    Logger("findRecievedMessage").info("");
    const messages = await RecievedMessage.find(filter);
    return messages;
  } catch (error) {
    Logger("findRecievedMessage").error(error);
    throw error;
  }
};

export const findSentMessage = async (
  filter: FilterQuery<ISentMessage>
): Promise<ISentMessage[] | []> => {
  try {
    Logger("findSentMessage").info("");
    const messages = await SentMessage.find(filter);
    return messages;
  } catch (error) {
    Logger("findSentMessage").error(error);
    throw error;
  }
};

export const sendTextMessage = async (messageData: ISentMessageCreate) => {
  Logger("sendTextMessage").info("");
  try {
    const user = await userService.getUserById(messageData.user);
    if (!user) {
      Logger("sendTextMessage").error("User not found");
      throw new Error("User not found");
    }

    // Send Message via Whatsapp
    const response = await whatsappHandler.sendMessage(
      user.contact,
      messageData.payload as string
    );

    // Store Sent Message
    await createSentMessage({
      ...messageData,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
      wamid: response.data.messages[0].id,
    });

    return response;
  } catch (error) {
    Logger("sendTextMessage").error(error);
    throw error;
  }
};

export const sendInteractiveMessage = async (
  messageData: ISentMessageCreate
) => {
  Logger("sendInteractiveMessage").info("");
  try {
    const user = await userService.getUserById(messageData.user);
    if (!user) {
      Logger("sendMessage").error("User not found");
      throw new Error("User not found");
    }

    const response = await whatsappHandler.sendInteractiveMessage(
      user.contact,
      messageData.interactive as InteractiveMessageBodyOptions
    );

    // Store Sent Message
    await createSentMessage({
      ...messageData,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
      wamid: response.data.messages[0].id,
    });

    return response;
  } catch (error) {
    Logger("sendInteractiveMessage").error(error);
    throw error;
  }
};

export const createSentMessage = async (
  messageData: ISentMessageCreate
): Promise<ISentMessage> => {
  try {
    Logger("createSentMessage").info("");
    const message = await SentMessage.create(messageData);
    return message;
  } catch (error) {
    Logger("createSentMessage").error(error);
    throw error;
  }
};

export const updateRecievedMessage = async (
  filter: FilterQuery<IRecievedMessage>,
  updates: UpdateQuery<IRecievedMessage>
): Promise<IRecievedMessage> => {
  try {
    Logger("updateRecievedMessageByWAID").info("");
    const recievedMessage = await RecievedMessage.findOneAndUpdate(
      filter,
      updates,
      { new: true }
    );

    if (!recievedMessage) {
      throw new Error("Recieved message not found");
    }

    return recievedMessage;
  } catch (error) {
    Logger("updateRecievedMessageByWAID").error(error);
    throw error;
  }
};

export const messageCountByUserPerPeriod = async (
  userId: string,
  startDate: Date,
  endDate: Date
) => {
  try {
    Logger("messageCountByUserPerPeriod").info("");
    const messages = await RecievedMessage.find({
      user: userId,
      createdAt: { $gte: startDate, $lte: endDate },
    });

    return messages.length;
  } catch (error) {
    Logger("messageCountByUserPerPeriod").error(error);
    throw error;
  }
};

export const sendTemplateMessage = async (messageData: ISentMessageCreate) => {
  Logger("sendTemplateMessage").info("");
  try {
    const user = await userService.getUserById(messageData.user);
    if (!user) {
      Logger("sendTemplateMessage").error("User not found");
      throw new Error("User not found");
    }

    const response = await whatsappHandler.sendTemplateMessage(
      user.contact,
      messageData.template as MessageTemplateObject<ComponentTypesEnum>
    );

    // Store Sent Message
    await createSentMessage({
      ...messageData,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
      wamid: response.data.messages[0].id,
    });

    return response;
  } catch (error) {
    Logger("sendTemplateMessage").error(error);
    console.log(error);
    throw error;
  }
};
