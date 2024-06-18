import logger from "../config/logger";
import * as openaiHandler from "../handlers/openai.handler";
import { IConversation } from "../models/conversation.model";
import { IUser } from "../models/user.model";
import { OpenAIMessageTypesEnum } from "../types/enums";
import * as conversationService from "./conversation.service";
const Logger = logger("services/openai.service");

interface IAskOptions {
  messageType: OpenAIMessageTypesEnum;
}

export const ask = async (
  data: string,
  user: IUser,
  conversation: IConversation,
  options: IAskOptions
) => {
  let openaiResponse: {
    result: string;
    threadId: string;
    newThreadCreated: boolean;
  };

  try {
    openaiResponse = await openaiHandler.ask(data, {
      preExistingThreadId: conversation.openaiThreadId,
      messageType: options.messageType,
    });
  } catch (error) {
    Logger("ask").error(error);
    throw error;
  }

  // Add thread id to the conversation if it exist
  if (openaiResponse.newThreadCreated) {
    await conversationService.updateConversation(
      { user: user.id },
      { openaiThreadId: openaiResponse.threadId }
    );
  }
  return openaiResponse.result;
};
