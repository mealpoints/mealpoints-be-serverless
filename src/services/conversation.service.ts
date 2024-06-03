import Conversation, { IConversation } from "../models/conversation.model";

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
