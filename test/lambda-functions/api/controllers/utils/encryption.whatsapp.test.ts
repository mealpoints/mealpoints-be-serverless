import { decryptRequest } from "../../../../../lambda-functions/api/controllers/utils/encryption.whatsapp";

const MOCK_DATA = {
  encrypted_flow_data:
    "MFlPbKZeMq5d49XFc4r/vcbzNUrhMnjcsWWiN5dY2tG0swn/8JWzl6odlUUpfOlP7w==",
  encrypted_aes_key:
    "Drr/jE60c7nPgQOMXqkSgSXRVhaUUym2LAsdOLGRitsTkywnSyNLTFPsdPXe+LBlILazSsCoJXLqXpMi5ZTL3Sjf7GdBuRuu8KJopiaFE0oAqTkCZ0vJSAOOnXwXJNEv4ShO9peJ8/T/D7r78zyCinxFrB88maKbk7XbJGxKR8t/gevQ6x0C9hU0RMAQfway99RcFY7bw4Gow4LRGtDI2bUyvv7XKaKGpP9GfpJUsv2NU6sLHTdHSQGTbM2wWwgj0g7Oxe/GuZ0PjQN89KSQLm7rmbCaWLUWcdhoODr+4BKUIVEEX0gku4pfqpBHj++EHkNsDrl2tqgpyGmP8LW9ZQ==",
  initial_vector: "17UNB0JPO/67qDFvsDhE8A==",
};

describe("decryptRequest", () => {
  it("should work properly", () => {
    const respinse = decryptRequest(
      MOCK_DATA,
      process.env.WHATSAPP_PRIVATE_PEM as string,
      process.env.WHATSAPP_PRIVATE_PASSPHRASE as string
    );
    console.log(respinse);
  });
});
