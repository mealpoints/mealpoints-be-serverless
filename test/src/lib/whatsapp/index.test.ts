import { processWebhook } from "../../../../ingress/lib/whatsapp";
import { processInboundMessageWebhook } from "../../../../ingress/lib/whatsapp/inboundMessages";
import { processStatusUpdateWebhook } from "../../../../ingress/lib/whatsapp/statusUpdates";
import { READ_MESSAGE_UPDATE } from "../../../mocks/whatsapp/readMessageUpdate.mock";
import { TEXT_MESSAGE_PAYLOAD } from "../../../mocks/whatsapp/textMessage.mock";

jest.mock(".../../../../ingress/lib/whatsapp/inboundMessages");
jest.mock("../../../../ingress/lib/whatsapp/statusUpdates");

describe("processWebhook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should process inbound message webhook", async () => {
    await processWebhook(TEXT_MESSAGE_PAYLOAD);

    expect(processInboundMessageWebhook).toHaveBeenCalledWith(
      TEXT_MESSAGE_PAYLOAD
    );
    expect(processStatusUpdateWebhook).not.toHaveBeenCalled();
  });

  test("should process status update webhook", async () => {
    await processWebhook(READ_MESSAGE_UPDATE);

    expect(processStatusUpdateWebhook).toHaveBeenCalledWith(
      READ_MESSAGE_UPDATE
    );
    expect(processInboundMessageWebhook).not.toHaveBeenCalled();
  });

  test("should handle error", async () => {
    const payload = {
      1: "something random",
    };

    // @ts-expect-error - Testing error case
    await processWebhook(payload);

    expect(processInboundMessageWebhook).not.toHaveBeenCalled();
    expect(processStatusUpdateWebhook).not.toHaveBeenCalled();
  });
});
