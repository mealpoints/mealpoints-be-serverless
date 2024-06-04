import Conversation, { IConversation } from "../models/conversation.model";
import RecievedMessage, {
  IRecievedMessage,
} from "../models/recievedMessage.model";
import SentMessage, { ISentMessage } from "../models/sentMessage.model";

export const createConversation = async (
  userId: string
): Promise<IConversation> => {
  console.debug("[conversation.serensureConversationcreateConversation]");
  const conversation = await Conversation.create({ user: userId });
  return conversation;
};

export const ensureConversation = async (
  userId: string
): Promise<IConversation> => {
  console.debug("[conversation.service/ensureConversation]");
  const conversation = await Conversation.findOne({ user: userId });
  if (!conversation) {
    console.debug(
      "[conversation.service/ensureConversation]: Conversation not found. Creating one"
    );
    return createConversation(userId);
  }
  return conversation;
};

export const getConversation = async (
  conversationId: string
): Promise<IConversation | null> => {
  console.debug("[conversation.service/getConversation]");
  const conversation = await Conversation.findById(conversationId);
  return conversation;
};

export const getConversationMessages = async (
  conversationId: string
): Promise<(ISentMessage | IRecievedMessage)[]> => {
  console.debug("[conversation.service/getConversationMessages]");
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
