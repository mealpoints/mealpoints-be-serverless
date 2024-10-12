import logger from "../config/logger";
import { OpenAIHandler } from "../handlers/openAI.handler";
import { IConversation } from "../models/conversation.model";
import { IUser } from "../models/user.model";
import { OpenAIMessageTypesEnum } from "../types/enums";
import { OpenAIResponse } from "../types/openai";
import * as conversationService from "./conversation.service";
const Logger = logger("services/openai.service");

interface IAskOptions {
  messageType: OpenAIMessageTypesEnum;
  assistantId: string;
}

export const ask = async (
  prompt: string,
  user: IUser,
  conversation: IConversation,
  options: IAskOptions
): Promise<OpenAIResponse> => {
  try {
    const openAIHandler = new OpenAIHandler(
      prompt,
      conversation,
      options.messageType,
      options.assistantId
    );

    const result = await openAIHandler.ask();
    const parsedResult = JSON.parse(result);
    Logger("ask").info(result);

    if (openAIHandler.newThreadCreated) {
      await conversationService.updateConversation(
        { user: user.id },
        {
          openaiThreadId: openAIHandler.threadId,
          openaiAssistantId: openAIHandler.assistantId,
        }
      );
    }

    return parsedResult;
  } catch (error) {
    Logger("ask").error(error);
    throw error;
  }
};
