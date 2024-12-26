import { parsePhoneNumberFromString } from "libphonenumber-js";
import logger from "../config/logger";
const Logger = logger("shared/util/processUserEngagement");

export const getMetaDataFromContact = (contact: string) => {
  let trimmedContact = contact.trim();

  if (!trimmedContact.startsWith("+")) {
    trimmedContact = `+${trimmedContact}`;
  }

  const parsedContact = parsePhoneNumberFromString(trimmedContact);
  if (!parsedContact || !parsedContact?.isValid()) {
    return undefined;
  }

  return parsedContact;
};

export const ensureContactFormat = (input: string): string | undefined => {
  if (!input) {
    throw new Error("Input is required");
  }

  try {
    // Ensure the input starts with a "+" sign. this is required by libphonenumber-js
    if (!input.startsWith("+")) {
      input = `+${input}`;
    }

    const phoneNumber = parsePhoneNumberFromString(input);

    if (!phoneNumber || !phoneNumber.isValid() || !phoneNumber.country) {
      return undefined;
    }
    return phoneNumber.number.replace("+", "");
  } catch (error) {
    Logger("ensureContactFormat").error(error);
    return undefined;
  }
};
