import logger from "../config/logger";
import { OpenAIHandler } from "../handlers/openAI.handler";
import { IUser } from "../models/user.model";
import * as openAIThreadService from "../services/openAIThread.service";
import { OpenAIMessageTypesEnum } from "../types/enums";
import { OpenAIResponse } from "../types/openai";
import { isValidJsonString } from "../utils/string";
const Logger = logger("services/openai.service");

interface IAskOptions {
  messageType: OpenAIMessageTypesEnum;
  assistantId: string;
  additionalInstructions?: string;
}

export const ask = async (
  prompt: string,
  user: IUser,
  options: IAskOptions
): Promise<OpenAIResponse> => {
  const openAIThread = await openAIThreadService.getLatestOpenAIThreadByUserId(
    user.id
  );

  try {
    const openAIHandler = new OpenAIHandler({
      prompt,
      openAIThread,
      messageType: options.messageType,
      assistantId: options.assistantId,
      additionalInstructions: options.additionalInstructions,
    });

    const result = await openAIHandler.ask();
    Logger("ask").info(result);

    if (openAIHandler.newThreadCreated) {
      await openAIThreadService.createOpenAIThread({
        user: user.id,
        threadId: openAIHandler.threadId,
        assistantId: options.assistantId,
      });
    }

    const normalizedResult = isValidJsonString(result)
      ? JSON.parse(result)
      : result;
    return normalizedResult;
  } catch (error) {
    Logger("ask").error(error);
    throw error;
  }
};
