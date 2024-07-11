import { SQSEvent } from "aws-lambda";
import { QUEUE_MESSAGE_GROUP_IDS } from "../../shared/config/config";
import { connectToDatabase } from "../../shared/config/database";
import logger from "../../shared/config/logger";
import { queue } from "../../shared/config/queue";
import { SqsQueueService } from "../../shared/services/queue.service";
import { SQSEventData } from "../../shared/utils/SQSEventData";
import { EventService } from "./services/event.service";
const Logger = logger("handler");

export const handler = async (sqsEvent: SQSEvent) => {
  await connectToDatabase();
  Logger("handler").info(JSON.stringify({ sqsEvent }));
  const eventData = new SQSEventData(sqsEvent);
  if (eventData.isMessageGroupId(QUEUE_MESSAGE_GROUP_IDS.whatsapp_messages)) {
    const queueService = new SqsQueueService(queue);
    const eventService = new EventService(queueService);
    await eventService.handle(sqsEvent);
  }
};
