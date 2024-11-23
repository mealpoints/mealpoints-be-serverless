import * as internalAlerts from "../../shared/libs/internal-alerts";
import { DEFAULT_GEO_INFO } from "../config/config";
import logger from "../config/logger";
import { CountryCodeToDefaultTimezoneEnum } from "../types/enums";
import { getMetaDataFromContact } from "./contact";
const Logger = logger("shared/utils/Timezone");

export const getTimeZoneFromCountryCode = (countryCode: string): string => {
  return CountryCodeToDefaultTimezoneEnum[
    countryCode as keyof typeof CountryCodeToDefaultTimezoneEnum
  ];
};

export const getGeoInfoFromcontact = async (contact: string) => {
  Logger("getGeoInfoFromcontact").info("");
  const parsedContact = getMetaDataFromContact(contact);

  if (!parsedContact || !parsedContact.country) {
    Logger("getGeoInfoFromcontact").error(
      "Failed to extract country code phone number, returning default timezone"
    );

    const { countryCode: defaultCountryCode } = DEFAULT_GEO_INFO;
    const defaultTimezone = getTimeZoneFromCountryCode(defaultCountryCode);

    await internalAlerts.sendInternalAlert({
      message: `${contact} has been assigned with default geo information (${defaultCountryCode}, ${defaultTimezone})`,
      severity: "minor",
    });

    return {
      countryCode: defaultCountryCode,
      timezone: defaultTimezone,
    };
  }

  const { country: countryCode } = parsedContact;
  let timezone = getTimeZoneFromCountryCode(countryCode);

  if (!timezone) {
    timezone = DEFAULT_GEO_INFO.timezone;
    await internalAlerts.sendInternalAlert({
      message: `INTERNAL ERROR: ${contact} has been assigned with timezone ${timezone} due to missing mapping for country code ${countryCode}.`,
      severity: "minor",
    });
  }

  return {
    countryCode,
    timezone,
  };
};

export const getTimeInTimezone = (date: Date, timezone: string): Date => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  // Format the date in the target timezone
  const parts = formatter.formatToParts(date);

  // Extract the components of the date
  const year = Number.parseInt(
    parts.find((p) => p.type === "year")?.value || "0",
    10
  );
  const month =
    Number.parseInt(parts.find((p) => p.type === "month")?.value || "0", 10) -
    1; // Months are 0-based
  const day = Number.parseInt(
    parts.find((p) => p.type === "day")?.value || "0",
    10
  );
  const hour = Number.parseInt(
    parts.find((p) => p.type === "hour")?.value || "0",
    10
  );
  const minute = Number.parseInt(
    parts.find((p) => p.type === "minute")?.value || "0",
    10
  );
  const second = Number.parseInt(
    parts.find((p) => p.type === "second")?.value || "0",
    10
  );

  // Construct a new UTC date
  return new Date(Date.UTC(year, month, day, hour, minute, second));
};

export const getLocaleTimeInTimezone = (date: Date, timezone: string): string => {
  return date.toLocaleString("en-GB", { timeZone: timezone });
};
