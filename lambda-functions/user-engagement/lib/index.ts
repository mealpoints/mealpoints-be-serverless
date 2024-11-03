import logger from "../../../shared/config/logger";
import SettingsSingleton from "../../../shared/config/settings";
import { getUsersWithoutEngagementMessagesInPeriod } from "../../../shared/services/userEngagement.service";
import {
  IUsersToSendReminders,
  IUsersToSendSummaries,
} from "../../../shared/types/queueMessages";
import { DateUtils } from "../../../shared/utils/DateUtils";
import { categorizeUsers } from "./categorizeUsers";
const Logger = logger("lib/processUserEngagement");

export const processUserEngagement = async () => {
  Logger("processUserEngagement").info("Starting user engagement process");
  const settings = await SettingsSingleton.getInstance();
  const engagmentMessageIntervalInDays = settings.get(
    "user-engangement.interval-in-days"
  ) as number;
  const reminderThresholdDate = new DateUtils()
    .subtractDays(engagmentMessageIntervalInDays)
    .toDate();
  const currentDate = new Date();

  try {
    /**
     * 1. Get users who have not received any engagement messages in last X days
     * 2. Categorize users whom to send summary and whom to reminders
     */
    const usersWithoutEngagementMessage =
      await getUsersWithoutEngagementMessagesInPeriod(
        reminderThresholdDate,
        currentDate
      );
    const usersToEngage: (IUsersToSendSummaries | IUsersToSendReminders)[] =
      await categorizeUsers(
        usersWithoutEngagementMessage,
        reminderThresholdDate
      );

    console.log(JSON.stringify(usersToEngage));

    // await enqueueUsersToSendEngagement(usersToEngage);

    Logger("processUserEngagement").info("Finished user engagement process");
  } catch (error) {
    Logger("processUserEngagement").error(
      "Error processing user engagement",
      error
    );
  }
};
