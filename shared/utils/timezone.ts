import * as internalAlerts from '../../shared/libs/internal-alerts';
import { DEFAULT_GEO_INFO } from '../config/config';
import logger from '../config/logger';
import { CountryCodeToTimezoneEnum } from '../types/enums';
import { parseContactWithMeta } from './contact';
const Logger = logger("shared/utils/Timezone");

export const getTimeZoneFromCountryCode = (countryCode: string): string => {
    return CountryCodeToTimezoneEnum[countryCode as keyof typeof CountryCodeToTimezoneEnum];
}

export const getGeoInfoFromcontact = async (contact: string) => {
    Logger("getGeoInfoFromcontact").info("");
    const parsedContact = parseContactWithMeta(contact)

    if (!parsedContact || !parsedContact.country) {
        Logger("getGeoInfoFromcontact").error("Failed to extract country code phone number, returning default timezone");

        const { countryCode: defaultCountryCode } = DEFAULT_GEO_INFO;
        const defaultTimezone = getTimeZoneFromCountryCode(defaultCountryCode);

        await internalAlerts.sendInternalAlert({
            message: `${contact} has been assigned with default geo information (${defaultCountryCode}, ${defaultTimezone})`,
            severity: "minor",
        })

        return {
            countryCode: defaultCountryCode,
            timezone: defaultTimezone,
        };
    }

    const { country: countryCode } = parsedContact;
    let timezone = getTimeZoneFromCountryCode(countryCode);

    if (!timezone) {
        timezone = DEFAULT_GEO_INFO.timezone
        await internalAlerts.sendInternalAlert({
            message: `INTERNAL ERROR: ${contact} has been assigned with timezone ${timezone} due to missing mapping for country code ${countryCode}.`,
            severity: "minor",
        })
    }

    return {
        countryCode,
        timezone
    };
}
