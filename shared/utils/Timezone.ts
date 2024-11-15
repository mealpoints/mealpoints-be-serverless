import { timezones } from 'libphonenumber-geo-carrier';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { GEO_INFO } from '../config/config';
import logger from '../config/logger';
const Logger = logger("shared/utils/Timezone");

export const getGeoInfoFromcontact = async (contact: string) => {
    Logger("getGeoInfoFromcontact").info("");
    contact = `+${contact}`;
    const parsePhoneNumber = parsePhoneNumberFromString(contact);
    if (!parsePhoneNumber) {
        Logger("getGeoInfoFromcontact").error("Failed to parse phone number to get geo info");
        return {
            countryCode: GEO_INFO.default.countryCode,
            timezone: GEO_INFO.default.timezone
        };
    }
    const countryCode = parsePhoneNumber.country ?? GEO_INFO.default.countryCode;
    const tZones = await timezones(parsePhoneNumber);
    // TODO: way to get tZone with most population would be better :)
    const timezone = tZones ? tZones[0] : GEO_INFO.default.timezone;

    return {
        countryCode,
        timezone
    };
}
