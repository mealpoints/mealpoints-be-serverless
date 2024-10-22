import { v4 as uuidv4 } from 'uuid';
import { QUEUE_MESSAGE_GROUP_IDS } from '../../../shared/config/config';
import logger from '../../../shared/config/logger';
import { queue } from '../../../shared/config/queue';
import { SqsQueueService } from '../../../shared/services/queue.service';
import { IUserWithLastMeal, IUserWithMeals } from '../../../shared/types/queueMessages';
import { hasMeals } from '../../../shared/utils/meal';

const Logger = logger("user-engagement/enqueue.service");

export const enqueueUsersToSendEngagement = async (
    usersToEngage: (IUserWithMeals | IUserWithLastMeal)[]
): Promise<void> => {
    Logger("enqueueUsersToSendEngagement").info(`Enqueuing ${usersToEngage.length} users for engagement`);
    const queueService = new SqsQueueService(queue);

    try {
        for (const user of usersToEngage) {
            const messageGroupId = hasMeals(user) ? QUEUE_MESSAGE_GROUP_IDS.meal_summary : QUEUE_MESSAGE_GROUP_IDS.reminder;
    
            await queueService.enqueueMessage({
                queueUrl: process.env.AWS_SQS_URL as string,
                messageBody: JSON.stringify({ body: user }),
                messageGroupId,
                messageDeduplicationId: uuidv4(),
            });
        }

        Logger("enqueueUsersToSendEngagement").info(`Enqueued ${usersToEngage.length} users for engagement`);
    } catch (error) {
        Logger("enqueueUsersToSendEngagement").error("Error enqueueing users", error);
        throw error;
    }
};
