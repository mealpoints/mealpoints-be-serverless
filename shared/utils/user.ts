import logger from "../config/logger";
import { IUser } from "../models/user.model";
import { getTimeInTimezone } from "./timezone";
const Logger = logger("shared/utils/user");

export const getUserLocalTime = (user: IUser): Date => {
  Logger("getUserLocalTime").info("");
  const { timezone } = user;
  return getTimeInTimezone(new Date(), timezone);
};

export const getInstructionForUser = (user: IUser): string => {
  return `The user is from ${
    user.countryCode
  }, and it's ${new Date().toLocaleString("en-GB", {
    timeZone: user.timezone,
  })} there.`;
};
