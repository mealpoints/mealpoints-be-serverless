import { parsePhoneNumberFromString } from "libphonenumber-js";

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
    console.error("Invalid phone number", error);
    // Return undefined if the input doesn't conform to a valid phone number format
    return undefined;
  }
};
