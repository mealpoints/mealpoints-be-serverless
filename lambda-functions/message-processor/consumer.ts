import { SQSEvent } from "aws-lambda";
import { QUEUE_MESSAGE_GROUP_IDS } from "../../shared/config/config";
import { connectToDatabase } from "../../shared/config/database";
import logger from "../../shared/config/logger";
import { queue } from "../../shared/config/queue";
import { SqsQueueService } from "../../shared/services/queue.service";
import { SQSEventData } from "../../shared/utils/SQSEventData";
import { processMealReport } from "./lib/meal-report";
import { processFeatIntro_MealViaText } from "./lib/meal-via-text";
import { processOnboardUser } from "./lib/onboard-user";
import { processReminder } from "./lib/reminder";
import { processSubscriptionExpired } from "./lib/subscription-expired";
import { processWhatsappWebhook } from "./lib/whatsapp";
import { EventService } from "./services/event.service";
import { processBldReminders } from "./lib/bld-reminders";
const Logger = logger("handler");

const messageProcessors = {
  [QUEUE_MESSAGE_GROUP_IDS.whatsapp_messages]: processWhatsappWebhook,
  [QUEUE_MESSAGE_GROUP_IDS.reminder]: processReminder,
  [QUEUE_MESSAGE_GROUP_IDS.bld_reminder]: processBldReminders,
  [QUEUE_MESSAGE_GROUP_IDS.meal_report]: processMealReport,
  [QUEUE_MESSAGE_GROUP_IDS.onboard_user]: processOnboardUser,
  [QUEUE_MESSAGE_GROUP_IDS.subscription_expired]: processSubscriptionExpired,
  [QUEUE_MESSAGE_GROUP_IDS.feat_intro_meal_via_text]:
    processFeatIntro_MealViaText,
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
