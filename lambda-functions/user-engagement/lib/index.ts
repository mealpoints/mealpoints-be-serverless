import logger from "../../../shared/config/logger";
import { UserEngagementMessageTypesEnum } from "../../../shared/types/enums";
import { mealSummariesFlow } from "./meal-summaries";
import { reminderFlow } from "./reminders";
const Logger = logger("lib/processUserEngagement");

export const executeFlow = async (
  flowName: UserEngagementMessageTypesEnum,
  timezone: string
) => {
  switch (flowName) {
    case UserEngagementMessageTypesEnum.Summary: {
      await mealSummariesFlow(timezone);
      break;
    }
    case UserEngagementMessageTypesEnum.Reminder: {
      await reminderFlow(timezone);
      break;
    }
    default: {
      Logger("executeFlow").error(`Unknown flow: ${flowName as string}`);
    }
  }
};
