import * as awsHandler from "../../../../src/handlers/aws.handler";
import * as whatsappHandler from "../../../../src/handlers/whatsapp.handler";
import { processImageMessage } from "../../../../src/lib/whatsapp/imageMessage";
import * as messageService from "../../../../src/services/message.service";
import { MessageTypesEnum } from "../../../../src/types/enums";
import { USER } from "../../../mocks/user.mock";
import { IMAGE_MESSAGE_PAYLOAD } from "../../../mocks/whatsapp/imageMessage.mock";

jest.mock("../../../../src/handlers/aws.handler");
jest.mock("../../../../src/handlers/whatsapp.handler");
jest.mock("../../../../src/services/message.service");

describe("processImageMessage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should process image message", async () => {
    const conversation = { id: "test-conversation-id" };

    (whatsappHandler.getImageSentViaMessage as jest.Mock).mockResolvedValue(
      "test-image-file-path"
    );
    (awsHandler.uploadImageToS3 as jest.Mock).mockResolvedValue("test-s3-path");
    (messageService.updateRecievedMessage as jest.Mock).mockResolvedValue({});
    (messageService.sendMessage as jest.Mock).mockResolvedValue({});

    // @ts-expect-error - we don't need to pass all the properties of the user object
    await processImageMessage(IMAGE_MESSAGE_PAYLOAD, USER, conversation);

    expect(whatsappHandler.getImageSentViaMessage).toHaveBeenCalledWith(
      "345150251694683"
    );
    expect(awsHandler.uploadImageToS3).toHaveBeenCalledWith(
      `${USER.id}/345150251694683`,
      "test-image-file-path"
    );
    expect(messageService.updateRecievedMessage).toHaveBeenCalledWith(
      {
        wamid:
          "wamid.HBgMOTE3MDIyNjI5OTM5FQIAEhgWM0VCMDEzODA1QUUwRTQ0ODFENUIzNwA=",
      },
      { media: "test-s3-path" }
    );
    expect(messageService.sendMessage).toHaveBeenCalledWith({
      user: USER.id,
      conversation: "test-conversation-id",
      payload: `This is stuff about the image message.`,
      type: MessageTypesEnum.Text,
    });
  });

  test("should throw error when processing fails", async () => {
    const user = { id: "test-user-id" };
    const conversation = { id: "test-conversation-id" };

    (whatsappHandler.getImageSentViaMessage as jest.Mock).mockRejectedValue(
      new Error("Test error")
    );

    await expect(
      // @ts-expect-error - We are intentionally passing an empty payload
      processImageMessage(IMAGE_MESSAGE_PAYLOAD, user, conversation)
    ).rejects.toThrow("Test error");
  });
});
