import { IUser } from './../../../shared/models/user.model';
import { IUserWithMeals } from '../../../shared/types/queueMessages';
import logger from '../../../shared/config/logger';

const Logger = logger("user-engagement/enqueue.service");

export const enqueueUsersToSendEngagement = async (
    usersToSendSummary: IUserWithMeals[],   
    usersToSendReminders: IUser[]         
): Promise<void> => {
    try {
        Logger("enqueueUsersToSendEngagement").info(`Enqueuing ${usersToSendSummary.length} users for summary`);
        usersToSendSummary.forEach(userWithMeals => {
            // Logic to enqueue each user along with their meals
        });

        Logger("enqueueUsersToSendEngagement").info(`Enqueuing ${usersToSendReminders.length} users for reminders`);
        usersToSendReminders.forEach(user => {
            // Logic to enqueue each user for reminders
        });

    } catch (error) {
        Logger("enqueueUsersToSendEngagement").error("Error enqueueing users", error);
        throw error;
    }
};
