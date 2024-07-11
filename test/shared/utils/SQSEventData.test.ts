/* eslint-disable unicorn/filename-case */
import { QUEUE_MESSAGE_GROUP_IDS } from "../../../shared/config/config";
import { SQSEventData } from "../../../shared/utils/SQSEventData";
import { SQS_EVENT } from "../../mocks/events/SQSEvent.mock";

describe("SQSEventData", () => {
  const sqsEventData = new SQSEventData(SQS_EVENT);
  test("should return the correct messageGroupId", () => {
    expect(
      sqsEventData.isMessageGroupId(QUEUE_MESSAGE_GROUP_IDS.whatsapp_messages)
    ).toBe(true);
  });
});
