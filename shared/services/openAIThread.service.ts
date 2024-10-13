import logger from "../config/logger";
import OpenAIThread, {
  IOpenAIThread,
  IOpenAIThreadCreate,
} from "../models/openAIThread.model";
const Logger = logger("openAIThread.service");

export const createOpenAIThread = async (
  data: IOpenAIThreadCreate
): Promise<IOpenAIThread> => {
  Logger("createOpenAIThread").info("");
  const openAIThread = await OpenAIThread.create(data);
  return openAIThread;
};

export const getLatestOpenAIThreadByUserId = async (
  userId: string
): Promise<IOpenAIThread | null> => {
  Logger("getLatestOpenAIThreadByUserId").info("");
  const openAIThread = await OpenAIThread.findOne({ user: userId }).sort({
    createdAt: -1,
  });
  return openAIThread;
};
