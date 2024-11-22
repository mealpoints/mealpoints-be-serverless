import logger from "../config/logger";
import { IUser } from "../models/user.model";
import { getZonedISOTime } from "./timezone";
const Logger = logger("shared/utils/user");

export const getUserLocalTime = (user: IUser): string => {
    Logger("getUserLocalTime").info("");
    const { timezone } = user;
    return getZonedISOTime(new Date(), timezone);
};

export const getInstructionStringForUser = (user: IUser): string => {
    return `The user is from ${user.countryCode}, and its ${user.localTime} there.`
}