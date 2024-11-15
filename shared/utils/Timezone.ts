import { timezones } from 'libphonenumber-geo-carrier';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const getTimeZoneFromcontact = async (contact: string) => {
    const parsePhoneNumber = parsePhoneNumberFromString(contact);
    const tZones = await timezones(parsePhoneNumber);
    // TODO: way to get tZone with most population would be better :)
    return tZones ? tZones[0] : '';
}
