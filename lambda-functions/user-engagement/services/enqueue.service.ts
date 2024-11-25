import { v4 as uuidv4 } from "uuid";
import logger from "../../../shared/config/logger";
import { queue } from "../../../shared/config/queue";
import { SqsQueueService } from "../../../shared/services/queue.service";
import {
  IUsersToSendReminders,
  IUsersToSendSummaries,
} from "../../../shared/types/queueMessages";

const Logger = logger("user-engagement/enqueue.service");

export const enqueueUsersToSendEngagement = async (
  usersToEngage: (IUsersToSendSummaries | IUsersToSendReminders)[]
): Promise<void> => {
  Logger("enqueueUsersToSendEngagement").info(
    `Enqueuing ${usersToEngage.length} users for engagement`
  );
  const queueService = new SqsQueueService(queue);

  try {
    for (const user of usersToEngage) {
      await queueService.enqueueMessage({
        queueUrl: process.env.AWS_SQS_URL as string,
        messageBody: JSON.stringify({ body: user }),
        messageGroupId: user.messageGroupId,
        messageDeduplicationId: uuidv4(),
      });
    }

    Logger("enqueueUsersToSendEngagement").info(
      `Enqueued ${usersToEngage.length} users for engagement`
    );
  } catch (error) {
    Logger("enqueueUsersToSendEngagement").error(
      "Error enqueueing users",
      error
    );
    throw error;
  }
};
