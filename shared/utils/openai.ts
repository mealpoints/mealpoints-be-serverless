import logger from "../config/logger";
import { IUser } from "../models/user.model";
import { getGlobalInstruction } from "./settings";
import { getInstructionForUser } from "./user";
const Logger = logger("shared/utils/openai");

export interface IGetOpenAiInstructionsParameters {
  user: IUser;
  imageCaption?: string;
}

const constructImgCaptionInstruction = (caption: string | undefined): string =>
  caption ? `Image Caption By User: ${caption}` : "";

export const getOpenAiInstructions = async (
  parameters: IGetOpenAiInstructionsParameters
): Promise<string> => {
  Logger("getOpenAiInstructions").info("");
  const { user, imageCaption } = parameters;
  return (
    (await getInstructionForUser(user)) +
    (await getGlobalInstruction()) +
    constructImgCaptionInstruction(imageCaption)
  );
};
