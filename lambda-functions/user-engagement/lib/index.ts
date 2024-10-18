import { USER_ENGAGEMENT_ALERT } from "../../../shared/config/config";
import logger from "../../../shared/config/logger";
import { getUsersWithoutEngagementMessagesInPeriod } from "../../../shared/services/userEngagement.service";
import { IUserWithLastMeal, IUserWithMeals } from "../../../shared/types/queueMessages";
import { DateUtils } from "../../../shared/utils/DateUtils";
import { enqueueUsersToSendEngagement } from "../services/enqueue.service";
import { categorizeUsers } from "./categorizeUsers";
const Logger = logger("lib/processUserEngagement");

export const processUserEngagement = async () => {

    Logger("processUserEngagement").info("Starting user engagement process");
    const reminderThresholdDate = new DateUtils().subtractDays(USER_ENGAGEMENT_ALERT.interval_in_days).toDate();
    const currentDate = new Date();

    try {
        /**
         * 1. Get users who have not received any engagement messages in last X days
         * 2. Categorize users whom to send summary and whom to reminders
         */
        const usersWithoutEngagementMessage = await getUsersWithoutEngagementMessagesInPeriod(reminderThresholdDate, currentDate);
        const usersToEngage: (IUserWithMeals | IUserWithLastMeal)[] = await categorizeUsers(usersWithoutEngagementMessage, reminderThresholdDate);

        await enqueueUsersToSendEngagement(usersToEngage);

        Logger("processUserEngagement").info("Finished user engagement process");
    } catch (error) {
        Logger("processUserEngagement").error("Error processing user engagement", error);
    }
}
