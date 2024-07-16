import logger from "../config/logger";
import SettingsSingleton from "../config/settings";
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
  const settings = await SettingsSingleton.getInstance();
  const assistantId = (await settings.get("openai_assistant_id")) as string;

  try {
    const openAIHandler = new OpenAIHandler(
      data,
      conversation,
      options.messageType,
      assistantId
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
