import logger from "../../../../shared/config/logger";
import SettingsSingleton from "../../../../shared/config/settings";
import * as userEngagementService from "../../../../shared/services/userEngagement.service";
import { UserEngagementMessageTypesEnum } from "../../../../shared/types/enums";
import { DateUtils } from "../../../../shared/utils/DateUtils";
import { enqueueUsersToSendEngagement } from "../../services/enqueue.service";

const Logger = logger("user-engagement/meal-summaries");

export const mealSummariesFlow = async (timezone: string) => {
  Logger("mealSummariesFlow").info(
    `Running meal summaries flow in ${timezone}`
  );

  try {
    const settings = await SettingsSingleton.getInstance();
    const engagmentMessageIntervalInDays = settings.get(
      "user-engagement.interval-in-days"
    ) as number;
    const startDate = new DateUtils()
      .subtractDays(engagmentMessageIntervalInDays)
      .toDate();
    const currentDate = new Date();

    const usersToSendSummaries =
      await userEngagementService.getUsersWithoutEngagementMessagesInPeriod({
        startDate,
        endDate: currentDate,
        timezone,
        type: UserEngagementMessageTypesEnum.Summary,
      });

    Logger("mealSummariesFlow").info(
      `Found ${usersToSendSummaries.length} users to send summaries`
    );

    if (usersToSendSummaries.length === 0) return;

    await enqueueUsersToSendEngagement(usersToSendSummaries, "meal_summary");
  } catch (error) {
    Logger("mealSummariesFlow").error(error);
  }
};
