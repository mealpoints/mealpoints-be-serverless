import * as awsHandler from "../../../../src/handlers/aws.handler";
import * as whatsappHandler from "../../../../src/handlers/whatsapp.handler";
import { processImageMessage } from "../../../../src/lib/whatsapp/imageMessage";
import * as messageService from "../../../../src/services/message.service";
import { MessageTypesEnum } from "../../../../src/types/enums";
import { IMAGE_MESSAGE_PAYLOAD } from "../../../mocks/whatsapp/imageMessage.mock";

jest.mock("../../../../src/handlers/aws.handler");
jest.mock("../../../../src/handlers/whatsapp.handler");
jest.mock("../../../../src/services/message.service");

describe("processImageMessage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should process image message", async () => {
    const user = {
      id: "test-user-id",
      contact: "test-phone-number",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const conversation = { id: "test-conversation-id" };

    whatsappHandler.getImageSentViaMessage.mockResolvedValue(
      "test-image-file-path"
    );
    awsHandler.uploadImageToS3.mockResolvedValue("test-s3-path");
    messageService.updateRecievedMessage.mockResolvedValue({});
    messageService.sendMessage.mockResolvedValue({});

    // @ts-expect-error - we don't need to pass all the properties of the user object
    await processImageMessage(IMAGE_MESSAGE_PAYLOAD, user, conversation);

    expect(whatsappHandler.getImageSentViaMessage).toHaveBeenCalledWith(
      "test-image-id"
    );
    expect(awsHandler.uploadImageToS3).toHaveBeenCalledWith(
      "test-user-id/test-image-id",
      "test-image-file-path"
    );
    expect(messageService.updateRecievedMessage).toHaveBeenCalledWith(
      { wamid: "test-message-id" },
      { media: "test-s3-path" }
    );
    expect(messageService.sendMessage).toHaveBeenCalledWith({
      user: "test-user-id",
      conversation: "test-conversation-id",
      payload: `This is stuff about the image message.`,
      type: MessageTypesEnum.Text,
    });
  });

  test("should throw error when processing fails", async () => {
    const payload = { entry: [] };
    const user = { id: "test-user-id" };
    const conversation = { id: "test-conversation-id" };

    whatsappHandler.getImageSentViaMessage.mockRejectedValue(
      new Error("Test error")
    );

    await expect(
      // @ts-expect-error - We are intentionally passing an empty payload
      processImageMessage(payload, user, conversation)
    ).rejects.toThrow("Test error");
  });
});
