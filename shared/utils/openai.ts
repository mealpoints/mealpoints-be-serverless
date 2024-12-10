import { IUser } from "../models/user.model";
import { getGlobalInstruction } from "./settings";
import { getInstructionForUser } from "./user";

export const getOpenAiInstructions = async (user: IUser): Promise<string> => {
    return await getInstructionForUser(user) + await getGlobalInstruction();
};