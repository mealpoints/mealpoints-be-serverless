import { sendInternalAlert } from "../../../shared/libs/internal-alerts";
import { getGeoInfoFromcontact } from "./../../../shared/utils/timezone";
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
