import { processWebhook } from "../../../../src/lib/whatsapp";
import { processInboundMessageWebhook } from "../../../../src/lib/whatsapp/inboundMessages";
import { processStatusUpdateWebhook } from "../../../../src/lib/whatsapp/statusUpdates";
import { READ_MESSAGE_UPDATE } from "../../../mocks/whatsapp/readMessageUpdate.mock";
import { TEXT_MESSAGE_PAYLOAD } from "../../../mocks/whatsapp/textMessage.mock";

jest.mock(".../../../../src/lib/whatsapp/inboundMessages");
jest.mock("../../../../src/lib/whatsapp/statusUpdates");

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
