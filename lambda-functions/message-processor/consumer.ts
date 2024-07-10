import { SQSEvent } from "aws-lambda";
import { connectToDatabase } from "../../shared/config/database";
import logger from "../../shared/config/logger";
import { queue } from "../../shared/config/queue";
import { SqsQueueService } from "../../shared/services/queue.service";
import { EventService } from "./services/event.service";
const Logger = logger("handler");

export const handler = async (sqsEvent: SQSEvent) => {
  await connectToDatabase();
  Logger("handler").debug(JSON.stringify({ sqsEvent }));
  // TODO: Consume message only from relevant messageGroupId
  const queueService = new SqsQueueService(queue);
  const eventService = new EventService(queueService);
  await eventService.handle(sqsEvent);
};
