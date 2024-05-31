// create message

import { connectToDatabase } from "../config/db";
import Message, { IMessage } from "../models/message.model";

export const createMessage = async (
  messageData: IMessage
): Promise<IMessage> => {
  await connectToDatabase();

  const message = await Message.create(messageData);
  return message;
};

export const getMessages = async (): Promise<IMessage[]> => {
  await connectToDatabase();

  const messages = await Message.find();
  return messages;
};
