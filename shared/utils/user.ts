import logger from "../config/logger";
import { IUser } from "../models/user.model";
import { CountryCodeToNameEnum } from "../types/enums";
import { getTimeInTimezone, getLocaleTimeInTimezone } from "./timezone";
const Logger = logger("shared/utils/user");

export const getUserLocalTime = (user: IUser): Date => {
  Logger("getUserLocalTime").info("");
  const { timezone } = user;
  return getTimeInTimezone(new Date(), timezone);
};

const timeAndLocationOfUser = (user: IUser) => {
  const countryName =
    CountryCodeToNameEnum[
      user.countryCode as keyof typeof CountryCodeToNameEnum
    ];
  
  const localDateTime = getLocaleTimeInTimezone(new Date(), user.timezone);
  
  return `The user is from ${countryName}, and it's ${localDateTime} in ${countryName} right now.`;
};

export const getInstructionForUser = (user: IUser): string => {
  return timeAndLocationOfUser(user);
};
