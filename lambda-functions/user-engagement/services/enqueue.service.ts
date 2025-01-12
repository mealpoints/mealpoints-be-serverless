import { v4 as uuidv4 } from "uuid";
import { QUEUE_MESSAGE_GROUP_IDS } from "../../../shared/config/config";
import logger from "../../../shared/config/logger";
import { queue } from "../../../shared/config/queue";
import { IUser } from "../../../shared/models/user.model";
import { SqsQueueService } from "../../../shared/services/queue.service";
import {
  IUserToSendReminders,
  IUserToSendSummaries,
  IUserWithSubscriptionId,
} from "../../../shared/types/queueMessages";

const Logger = logger("user-engagement/enqueue.service");

export const enqueueUsersToSendEngagement = async (
  usersToEngage: (
    | IUserWithSubscriptionId
    | IUserToSendSummaries
    | IUserToSendReminders
    | IUser
  )[],
  messageGroupId: keyof typeof QUEUE_MESSAGE_GROUP_IDS
): Promise<void> => {
  Logger("enqueueUsersToSendEngagement").info(
    `Enqueuing ${usersToEngage.length} users for engagement with the messageGroupId: ${messageGroupId}`
  );
  const queueService = new SqsQueueService(queue);

  try {
    for (const user of usersToEngage) {
      const messageBody = JSON.stringify({ body: user });

      await queueService.enqueueMessage({
        queueUrl: process.env.AWS_SQS_URL as string,
        messageBody,
        messageGroupId,
        messageDeduplicationId: uuidv4(),
      });
    }

    Logger("enqueueUsersToSendEngagement").info(
      `Enqueued ${usersToEngage.length} users for engagement with the messageGroupId: ${messageGroupId}`
    );
  } catch (error) {
    Logger("enqueueUsersToSendEngagement").error(error);
    throw error;
  }
};
