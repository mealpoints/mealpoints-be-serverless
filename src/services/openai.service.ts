import logger from "../config/logger";
import { OpenAIHandler } from "../handlers/openAI.handler";
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
  let openAIResponse: {
    result: string;
    threadId: string;
    newThreadCreated: boolean;
  };

  try {
    const OpenAIHandlerObject = new OpenAIHandler(data, {
      preExistingThreadId: conversation.openaiThreadId,
      messageType: options.messageType,
      user,
    });

    openAIResponse = await OpenAIHandlerObject.ask();
  } catch (error) {
    Logger("ask").error(error);
    throw error;
  }

  if (openAIResponse.newThreadCreated) {
    await conversationService.updateConversation(
      { user: user.id },
      { openaiThreadId: openAIResponse.threadId }
    );
  }
  return openAIResponse.result;
};
