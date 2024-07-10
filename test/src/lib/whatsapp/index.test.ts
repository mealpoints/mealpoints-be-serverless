import { processWhatsappWebhook } from "../../../../api/lib/whatsapp";
import { processInboundMessageWebhook } from "../../../../api/lib/whatsapp/inboundMessages";
import { processStatusUpdateWebhook } from "../../../../api/lib/whatsapp/statusUpdates";
import { READ_MESSAGE_UPDATE } from "../../../mocks/whatsapp/readMessageUpdate.mock";
import { TEXT_MESSAGE_PAYLOAD } from "../../../mocks/whatsapp/textMessage.mock";

jest.mock(".../../../../api/lib/whatsapp/inboundMessages");
jest.mock("../../../../api/lib/whatsapp/statusUpdates");

describe("processWhatsappWebhook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should process inbound message webhook", async () => {
    await processWhatsappWebhook(TEXT_MESSAGE_PAYLOAD);

    expect(processInboundMessageWebhook).toHaveBeenCalledWith(
      TEXT_MESSAGE_PAYLOAD
    );
    expect(processStatusUpdateWebhook).not.toHaveBeenCalled();
  });

  test("should process status update webhook", async () => {
    await processWhatsappWebhook(READ_MESSAGE_UPDATE);

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
    await processWhatsappWebhook(payload);

    expect(processInboundMessageWebhook).not.toHaveBeenCalled();
    expect(processStatusUpdateWebhook).not.toHaveBeenCalled();
  });
});
