import { getGeoInfoFromcontact } from './../../../shared/utils/timezone';
import { CONTACT_MOCK_FOR_GEOINFO } from './../../mocks/contacts.mock';

describe('getGeoInfoFromcontact', () => {
    Object.entries(CONTACT_MOCK_FOR_GEOINFO).forEach(([testName, testCase]) => {
        it(`should handle the ${testName} contact case`, () => {
            const result = getGeoInfoFromcontact(testCase.contact);
            expect(result).toEqual(testCase.expectedResult);
        })
    })
});