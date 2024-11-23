import { sendInternalAlert } from "../../../shared/libs/internal-alerts";
import { CountryCodeToDefaultTimezoneEnum } from "../../../shared/types/enums";
import {
  getGeoInfoFromcontact,
  getTimeInTimezone,
} from "./../../../shared/utils/timezone";
import { CONTACT_MOCK_FOR_GEOINFO } from "./../../mocks/contacts.mock";

jest.mock("../../../shared/libs/internal-alerts", () => ({
  sendInternalAlert: jest.fn(),
}));

describe("getGeoInfoFromcontact", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  Object.entries(CONTACT_MOCK_FOR_GEOINFO).forEach(([testName, testCase]) => {
    it(`should handle the ${testName} contact case`, async () => {
      const InteralAlertCalls = (sendInternalAlert as jest.Mock).mock.calls;
      (sendInternalAlert as jest.Mock).mockResolvedValue({});

      const result = await getGeoInfoFromcontact(testCase.contact);
      expect(result).toEqual(testCase.expectedResult);

      if (
        [
          "invalid",
          "missingCountryCode",
          "invalidCountryCode",
          "missingCountryCodeInMapping",
        ].includes(testName)
      ) {
        expect(InteralAlertCalls).toHaveLength(1);
      } else {
        expect(InteralAlertCalls).toHaveLength(0);
      }
    });
  });
});

describe.only("getTimeinTimeZone", () => {
  it("should return the correct time in a + diff timezone (UTC+X)", () => {
    const date = new Date("2024-11-23T00:00:00.000+00:00");
    const expectedTime = new Date("2024-11-23T05:30:00.000Z");

    const result = getTimeInTimezone(date, CountryCodeToDefaultTimezoneEnum.IN);
    expect(result).toEqual(expectedTime);
  });

  it("should return the correct time in a - diff timezone (UTC-X)", () => {
    const date = new Date("2024-11-23T00:00:00.000+00:00");
    const expectedTime = new Date("2024-11-22T19:00:00.000Z");

    const result = getTimeInTimezone(date, CountryCodeToDefaultTimezoneEnum.US);
    expect(result).toEqual(expectedTime);
  });

  it("should return the correct time in a 0 diff timezone (UTC)", () => {
    const date = new Date("2024-11-23T00:00:00.000+00:00");
    const expectedTime = new Date("2024-11-23T00:00:00.000Z");

    const result = getTimeInTimezone(date, CountryCodeToDefaultTimezoneEnum.GB);
    expect(result).toEqual(expectedTime);
  });
});
