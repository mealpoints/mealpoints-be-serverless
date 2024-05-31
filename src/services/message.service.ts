// create message

import Message, { IMessage } from "../models/message.model";

export const createMessage = async (
  messageData: IMessage
): Promise<IMessage> => {
  console.debug("message.service: Creating message");
  const message = await Message.create(messageData);
  return message;
};

export const getMessages = async (): Promise<IMessage[]> => {
  console.debug("message.service: Getting messages");
  const messages = await Message.find();
  return messages;
};
