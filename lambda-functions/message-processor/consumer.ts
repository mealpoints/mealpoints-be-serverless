import { SQSEvent } from "aws-lambda";
import { QUEUE_MESSAGE_GROUP_IDS } from "../../shared/config/config";
import { connectToDatabase } from "../../shared/config/database";
import logger from "../../shared/config/logger";
import { queue } from "../../shared/config/queue";
import { SqsQueueService } from "../../shared/services/queue.service";
import { SQSEventData } from "../../shared/utils/SQSEventData";
import { processMealSummary } from "./lib/meal-sumary";
import { processReminder } from "./lib/reminder";
import { processWhatsappWebhook } from "./lib/whatsapp";
import { EventService } from "./services/event.service";
const Logger = logger("handler");

const messageProcessors = {
  [QUEUE_MESSAGE_GROUP_IDS.whatsapp_messages]: processWhatsappWebhook,
  [QUEUE_MESSAGE_GROUP_IDS.meal_summary]: processMealSummary,
  [QUEUE_MESSAGE_GROUP_IDS.reminder]: processReminder,
};

export const handler = async (sqsEvent: SQSEvent) => {
  Logger("handler").info(JSON.stringify({ sqsEvent }));
  await connectToDatabase();

  const eventData = new SQSEventData(sqsEvent);
  const queueService = new SqsQueueService(queue);

  if (!eventData.messageGroupId) {
    Logger("handler").error("Unknown message group ID");
    return;
  }

  const processMessage = messageProcessors[eventData.messageGroupId];

  if (processMessage) {
    Logger("handler").info(`Processing ${eventData.messageGroupId} messages`);
    // TODO: Fix the type error for processMessage
    // @ts-expect-error - processMessage is a function
    const eventService = new EventService(queueService, processMessage);
    await eventService.handle(sqsEvent);
  } else {
    Logger("handler").error("Unknown message group ID");
  }
};

export const handler1 = async (sqsEvent: SQSEvent) => {
  Logger("handler").info(JSON.stringify({ sqsEvent }));
  await connectToDatabase();

  const eventData = new SQSEventData(sqsEvent);
  const queueService = new SqsQueueService(queue);

  switch (eventData.messageGroupId) {
    case QUEUE_MESSAGE_GROUP_IDS.whatsapp_messages: {
      Logger("handler").info("Processing WhatsApp messages");
      const eventService = new EventService(
        queueService,
        processWhatsappWebhook
      );
      await eventService.handle(sqsEvent);
      break;
    }
    case QUEUE_MESSAGE_GROUP_IDS.meal_summary: {
      Logger("handler").info("Processing meal summary messages");
      const eventService = new EventService(queueService, processMealSummary);
      await eventService.handle(sqsEvent);
      break;
    }
    case QUEUE_MESSAGE_GROUP_IDS.reminder: {
      Logger("handler").info("Processing reminder messages");
      const eventService = new EventService(queueService, processReminder);
      await eventService.handle(sqsEvent);
      break;
    }
    default: {
      Logger("handler").error("Unknown message group ID");
    }
  }
};
