import request from "supertest";
import { app } from "../../../lambda-functions/api/app";
import { processWhatsappWebhook } from "../../../lambda-functions/message-processor/lib/whatsapp";
import ApiResponse from "../../../shared/utils/ApiResponse";
import { TEXT_MESSAGE_PAYLOAD } from "../../mocks/whatsapp/textMessage.mock";

const PATH = "/v1/whatsapp-webhook";

jest.mock("../../../lambda-functions/message-processor/lib/whatsapp", () => ({
  processWhatsappWebhook: jest.fn(),
}));

jest.mock("../../../shared/utils/ApiResponse", () => ({
  Ok: jest.fn(),
  ServerError: jest.fn(),
}));

describe("Webhook Controllers", () => {
  beforeEach(() => {
    process.env.WHATSAPP_VERIFICATION_KEY = "valid_verification_token";
  });
  describe("verifyWebhook Controller", () => {
    it("should return 200 and the challenge when the verification token is valid", async () => {
      const response = await request(app).get(PATH).query({
        "hub.verify_token": "valid_verification_token",
        "hub.challenge": "challenge_code",
      });

      expect(response.status).toBe(200);
      expect(response.text).toBe("challenge_code");
    });

    it("should return 403 when the verification token is invalid", async () => {
      const response = await request(app).get(PATH).query({
        "hub.verify_token": "invalid_verification_token",
      });

      expect(response.status).toBe(403);
      expect(response.text).toBe("Invalid verify token");
    });
  });

  describe.skip("readMessage Controller", () => {
    it("should call processWhatsappWebhook and return Ok response", async () => {
      const response = await request(app).post(PATH).send(TEXT_MESSAGE_PAYLOAD);
      (processWhatsappWebhook as jest.Mock).mockResolvedValueOnce(undefined);
      expect(processWhatsappWebhook).toHaveBeenCalledWith(TEXT_MESSAGE_PAYLOAD);
      expect(ApiResponse.Ok).toHaveBeenCalledWith(response, "Message read");
    });
  });
});
