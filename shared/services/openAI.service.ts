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

const ASSITANT_ID = process.env.OPENAI_ASSISTANT_ID as string;

export const ask = async (
  data: string,
  user: IUser,
  conversation: IConversation,
  options: IAskOptions
) => {
  try {
    const openAIHandler = new OpenAIHandler(
      data,
      conversation,
      options.messageType
    );

    const result = await openAIHandler.ask();

    if (openAIHandler.newThreadCreated) {
      await conversationService.updateConversation(
        { user: user.id },
        {
          openaiThreadId: openAIHandler.threadId,
          openaiAssistantId: openAIHandler.assistantId,
        }
      );
    }

    return result;
  } catch (error) {
    Logger("ask").error(error);
    throw error;
  }
};
