import { SQSEvent } from "aws-lambda";
import { QUEUE_MESSAGE_GROUP_IDS } from "../../shared/config/config";
import { connectToDatabase } from "../../shared/config/database";
import logger from "../../shared/config/logger";
import { queue } from "../../shared/config/queue";
import { SqsQueueService } from "../../shared/services/queue.service";
import { SQSEventData } from "../../shared/utils/SQSEventData";
import { processMealReport } from "./lib/meal-report";
import { processMealSummary } from "./lib/meal-sumary";
import { processRemindMealViaText } from "./lib/meal-via-text";
import { processOnboardUser } from "./lib/onboard-user";
import { processReminder } from "./lib/reminder";
import { processWhatsappWebhook } from "./lib/whatsapp";
import { EventService } from "./services/event.service";
const Logger = logger("handler");

const messageProcessors = {
  [QUEUE_MESSAGE_GROUP_IDS.whatsapp_messages]: processWhatsappWebhook,
  [QUEUE_MESSAGE_GROUP_IDS.meal_summary]: processMealSummary,
  [QUEUE_MESSAGE_GROUP_IDS.reminder]: processReminder,
  [QUEUE_MESSAGE_GROUP_IDS.meal_report]: processMealReport,
  [QUEUE_MESSAGE_GROUP_IDS.onboard_user]: processOnboardUser,
  [QUEUE_MESSAGE_GROUP_IDS.remind_meal_via_text]: processRemindMealViaText,
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

  const processMessage =
    messageProcessors[
      eventData.messageGroupId as keyof typeof QUEUE_MESSAGE_GROUP_IDS
    ];

  if (processMessage) {
    Logger("handler").info(`Processing ${eventData.messageGroupId} messages`);

    type MessageProcessor = (messageBody: unknown) => Promise<void>;
    const eventService = new EventService(
      queueService,
      processMessage as MessageProcessor
    );

    await eventService.handle(sqsEvent);
  } else {
    Logger("handler").error("Unknown message group ID");
  }
};
