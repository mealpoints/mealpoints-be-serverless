import { DEFAULT_GEO_INFO } from "../../shared/config/config";

export const CONTACT_NUMBERS = {
  madhav_in: "917022629939",
  madhav_de: "4915228278209",
  aniket_in: "919930941116",
  shruti_in: "919540599849",
  shruti_de: "4915123564195",
  kairav_in: "919967900241",
  niraj_in: "917400217755",
};

export const CONTACT_MOCK_FOR_GEOINFO = {
  invalid: {
    contact: 'invalid-phone',
    expectedResult: DEFAULT_GEO_INFO,
  },
  valid: {
    contact: '+917400217755',
    expectedResult: {
      countryCode: 'IN',
      timezone: 'Asia/Kolkata',
    },
  },
  missingPlus: {
    contact: '917400217755',
    expectedResult: {
      countryCode: 'IN',
      timezone: 'Asia/Kolkata',
    },
  },
  missingCountryCode: {
    contact: '7400217755',
    expectedResult: DEFAULT_GEO_INFO,
  },
  invalidCountryCode: {
    contact: '+999999999999',
    expectedResult: DEFAULT_GEO_INFO,
  },
  missingCountryCodeInMapping: {
    contact: '+263712345678',  // Zimbabwe's valid contact number
    expectedResult: {
      countryCode: 'ZW',
      timezone: 'Asia/Kolkata',
    },
  },
};
