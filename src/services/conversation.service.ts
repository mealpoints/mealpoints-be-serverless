import logger from "../config/logger";
import Conversation, { IConversation } from "../models/conversation.model";
import RecievedMessage, {
  IRecievedMessage,
} from "../models/recievedMessage.model";
import SentMessage, { ISentMessage } from "../models/sentMessage.model";
const Logger = logger("conversation.service");

export const createConversation = async (
  userId: string
): Promise<IConversation> => {
  Logger("createConversation").debug("");
  const conversation = await Conversation.create({ user: userId });
  return conversation;
};

export const ensureConversation = async (
  userId: string
): Promise<IConversation> => {
  Logger("ensureConversation").debug("");
  const conversation = await Conversation.findOne({ user: userId });
  if (!conversation) {
    Logger("ensureConversation").debug("convesation not found. Creating...");
    return createConversation(userId);
  }
  return conversation;
};

export const getConversation = async (
  conversationId: string
): Promise<IConversation | null> => {
  Logger("getConversation").debug("");
  const conversation = await Conversation.findById(conversationId);
  return conversation;
};

export const getConversationMessages = async (
  conversationId: string
): Promise<(ISentMessage | IRecievedMessage)[]> => {
  Logger("getConversationMessages").debug("");
  let conversationMessages = [];

  const sentMessages = await SentMessage.find({ conversation: conversationId });
  const recievedMessages = await RecievedMessage.find({
    conversation: conversationId,
  });

  conversationMessages = [...sentMessages, ...recievedMessages];

  conversationMessages.sort((a, b) => {
    return a.createdAt > b.createdAt ? -1 : 1;
  });

  return conversationMessages;
};
