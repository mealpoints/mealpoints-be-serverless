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

export const createRecievedMessage = async (
  messageData: IRecievedMessageCreate
): Promise<IRecievedMessage> => {
  console.debug("[message.service/createRecievedMessage]");
  const message = await RecievedMessage.create(messageData);
  return message;
};

export const createSentMessage = async (
  messageData: ISentMessageCreate
): Promise<ISentMessage> => {
  try {
    console.debug("[message.service/createSentMessage]");
    const message = await SentMessage.create(messageData);
    return message;
  } catch (error) {
    console.error("[message.service/createSentMessage]: Error:", error);
    throw error;
  }
};

export const updateSentMessageStatusByWAID = async (
  wamid: string,
  status: StatusEnum
): Promise<ISentMessage> => {
  try {
    console.debug("[message.service/updateSentMessageStatusByWAID]");
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
    console.error(
      "[message.service/updateSentMessageStatusByWAID]: Error:",
      error
    );
    throw error;
  }
};

export const updateSentMessageStatus = async (
  messageId: string,
  status: StatusEnum
): Promise<ISentMessage> => {
  try {
    console.debug("[message.service/updateSentMessageStatus]");
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
    console.error("[message.service/updateSentMessageStatus]: Error:", error);
    throw error;
  }
};

export const sendMessage = async (messageData: ISentMessageCreate) => {
  console.debug("[message.service/sendMessage]");
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
        console.error("[message.service/sendMessage]: Error:", error);
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
    console.error("[message.service/sendMessage]: Error:", error);
    throw error;
  }
};
