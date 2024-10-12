import logger from "../config/logger";
import SettingsSingleton from "../config/settings";
import { OpenAIHandler } from "../handlers/openAI.handler";
import { IConversation } from "../models/conversation.model";
import { IUser } from "../models/user.model";
import { OpenAIMessageTypesEnum } from "../types/enums";
import { OpenAIResponse } from "../types/openai";
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
): Promise<OpenAIResponse> => {
  const settings = await SettingsSingleton.getInstance();

  const assistantId = settings.get("openai_assistant_id");

  if (!assistantId) {
    throw new Error("OpenAI assistant ID is not set in settings");
  }

  try {
    const openAIHandler = new OpenAIHandler(
      data,
      conversation,
      options.messageType,
      assistantId as string
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
