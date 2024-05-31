import Message, { IMessage, IMessageCreate } from "../models/message.model";

export const createMessage = async (
  messageData: IMessageCreate
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
