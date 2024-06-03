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
  console.debug("[message.service/createRecievedMessage]: Creating message");
  const message = await RecievedMessage.create(messageData);
  return message;
};

export const createSentMessage = async (
  messageData: ISentMessageCreate
): Promise<ISentMessage> => {
  try {
    console.debug("[message.service/createSentMessage]: Creating message");
    const message = await SentMessage.create(messageData);
    return message;
  } catch (error) {
    console.error("[message.service/createSentMessage]: Error: ", error);
    throw error;
  }
};

export const updateSentMessageStatusByWAID = async (
  wamid: string,
  status: StatusEnum
): Promise<ISentMessage> => {
  try {
    console.debug(
      "[message.service/updateSentMessageStatusByWAID]: Updating message"
    );
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
      "[message.service/updateSentMessageStatusByWAID]: Error: ",
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
    console.debug(
      "[message.service/updateSentMessageStatus]: Updating message"
    );
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
    console.error("[message.service/updateSentMessageStatus]: Error: ", error);
    throw error;
  }
};

export const sendMessage = async (messageData: ISentMessageCreate) => {
  console.debug(
    "[message.service/sendMessage]:  Sending message: ",
    JSON.stringify(messageData)
  );
  try {
    const user = await userService.getUserById(messageData.user);
    if (!user) {
      throw new Error("User not found");
    }

    // Send Message via Whatsapp
    const res = await whatsappHandler
      .sendMessage(user.contact, messageData.payload)
      .catch((err) => {
        updateSentMessageStatus(sentMessage.id, StatusEnum.Failed);
        console.error("[message.service/sendMessage]: Error: ", err);
        throw err;
      });

    console.log(res.data);

    // Store Sent Message
    const sentMessage = await createSentMessage({
      ...messageData,
      wamid: res.data.messages[0].id,
    });

    return res;
  } catch (error) {
    console.error("[message.service/sendMessage]: Error: ", error);
    throw error;
  }
};
