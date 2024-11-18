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
}

