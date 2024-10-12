import { USER_ENGAGEMENT_ALERT } from "../../../shared/config/config";
import logger from "../../../shared/config/logger";
import { getUsersWithoutEngagementMessagesInPeriod } from "../../../shared/services/userEngagement.service";
import { DateUtils } from "../../../shared/utils/DateUtils";
import { categorizeUsers } from "./categorizeUsers";
const Logger = logger("lib/processUserEngagement");

export const processUserEngagement = async () => {

    Logger("processUserEngagement").info("Starting user engagement process");
    const dateMinusInterval = new DateUtils().subtractDays(USER_ENGAGEMENT_ALERT.interval_in_days).toDate();
    const currentDate = new Date();

    try {
        /**
         * 1. Get users who have not received any engagement messages in last X days
         * 2. Categorize users whom to send summary and whom to reminders
         */
        const usersWithoutEngagementAlerts = await getUsersWithoutEngagementMessagesInPeriod(dateMinusInterval, currentDate);
        Logger("processUserEngagement").info(`Users without engagement alerts: ${usersWithoutEngagementAlerts.length}`);
        const { usersToSendSummary, usersToSendReminders } = await categorizeUsers(usersWithoutEngagementAlerts, dateMinusInterval);

        Logger("processUserEngagement").info(`Users to send summary: ${usersToSendSummary.length}`);
        Logger("processUserEngagement").info(`Users to send reminders: ${usersToSendReminders.length}`);

        // TODO: Push to SQS to process OpenService.ask() per user

        Logger("processUserEngagement").info("Finished user engagement process");
    } catch (error) {
        Logger("processUserEngagement").error("Error processing user engagement", error);
        throw error;
    }
}
