import { SQSEvent } from "aws-lambda";
import { connectToDatabase } from "../../shared/config/database";
import logger from "../../shared/config/logger";
import Settings from "../../shared/config/settings";
import { SettingEnum } from "../../shared/types/enums";
const Logger = logger("handler");

export const handler = async (sqsEvent: SQSEvent) => {
  Logger("handler").info(JSON.stringify({ sqsEvent }));
  await connectToDatabase();
  const settings = await Settings.getInstance();
  console.log(settings.get(SettingEnum.OpenAI_AssistantId));

  // const eventData = new SQSEventData(sqsEvent);
  // if (eventData.isMessageGroupId(QUEUE_MESSAGE_GROUP_IDS.whatsapp_messages)) {
  //   const queueService = new SqsQueueService(queue);
  //   const eventService = new EventService(queueService);
  //   await eventService.handle(sqsEvent);
  // }
};
