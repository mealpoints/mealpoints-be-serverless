import { WebhookTypesEnum } from "../../../shared/types/enums";
import { WhatsappData } from "../../../shared/utils/WhatsappData";
import { IMAGE_MESSAGE_PAYLOAD } from "../../mocks/whatsapp/imageMessage.mock";
import { READ_MESSAGE_UPDATE } from "../../mocks/whatsapp/readMessageUpdate.mock";
import { TEXT_MESSAGE_PAYLOAD } from "../../mocks/whatsapp/textMessage.mock";

describe("WhatsappData", () => {
  let whatsappDataText: WhatsappData;
  let whatsappDataStatus: WhatsappData;
  let whatsappDataImage: WhatsappData;
  beforeAll(() => {
    whatsappDataText = new WhatsappData(TEXT_MESSAGE_PAYLOAD);
    whatsappDataStatus = new WhatsappData(READ_MESSAGE_UPDATE);
    whatsappDataImage = new WhatsappData(IMAGE_MESSAGE_PAYLOAD);
  });
  test("should return the correct webhook message type", () => {
    expect(whatsappDataText.webhookMessageType).toBe("inboundMessage");
    expect(whatsappDataStatus.webhookMessageType).toBe("statusUpdate");
    expect(whatsappDataImage.webhookMessageType).toBe("inboundMessage");
  });

  test("should return the correct webhook type", () => {
    expect(whatsappDataText.isInboundMessage).toBe(true);
    expect(whatsappDataStatus.isStatusUpdate).toBe(true);
    expect(whatsappDataImage.isInboundMessage).toBe(true);
  });

  test("should return correct whatsappMessageId ", () => {
    expect(whatsappDataText.whatsappMessageId).toBe(
      "wamid.HBgMOTE3MDIyNjI5OTM5FQIAEhgWM0VCMDAwQTA0MjUxNkI3RTRBQTMzMQA="
    );
    expect(whatsappDataImage.whatsappMessageId).toBe(
      "wamid.HBgMOTE3MDIyNjI5OTM5FQIAEhgWM0VCMDEzODA1QUUwRTQ0ODFENUIzNwA="
    );
    expect(whatsappDataStatus.whatsappMessageId).toBe(
      "wamid.HBgMOTE3MDIyNjI5OTM5FQIAERgSQzY3ODU4QUE2OTUwRjA1QThGAA=="
    );
  });

  test("should return correct webhookType", () => {
    expect(whatsappDataText.webhookType).toBe(WebhookTypesEnum.Text);
    expect(whatsappDataImage.webhookType).toBe(WebhookTypesEnum.Image);
    expect(whatsappDataStatus.webhookType).toBe(WebhookTypesEnum.Unknown);
  });

  test("should return correct phoneNumberId", () => {
    expect(whatsappDataText.phoneNumberId).toBe("100498292800637");
    expect(whatsappDataImage.phoneNumberId).toBe("100498292800637");
    expect(whatsappDataStatus.phoneNumberId).toBe("100498292800637");
  });

  test("should return correct contact", () => {
    expect(whatsappDataText.contact).toBe("917022629939");
    expect(whatsappDataImage.contact).toBe("917022629939");
    expect(whatsappDataStatus.contact).toBe("917022629939");
  });

  test("should return correct userMessage", () => {
    expect(whatsappDataText.userMessage).toBe("hey there");
    expect(whatsappDataImage.userMessage).toBeUndefined();
    expect(whatsappDataStatus.userMessage).toBeUndefined();
  });

  test("should return correct imageId", () => {
    expect(whatsappDataText.imageId).toBeUndefined();
    expect(whatsappDataImage.imageId).toBe("345150251694683");
    expect(whatsappDataStatus.imageId).toBeUndefined();
  });

  test("isMessageFromWatsappPhoneNumberId should return correct value", () => {
    expect(
      whatsappDataText.isMessageFromWatsappPhoneNumberId("100498292800637")
    ).toBe(true);
    expect(
      whatsappDataImage.isMessageFromWatsappPhoneNumberId("100498292800637")
    ).toBe(true);
    expect(
      whatsappDataStatus.isMessageFromWatsappPhoneNumberId("100498292800638")
    ).toBe(false);
  });
});
