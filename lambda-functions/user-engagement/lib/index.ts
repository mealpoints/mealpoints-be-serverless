import logger from "../../../shared/config/logger";
import { UserEngagementMessageTypesEnum } from "../../../shared/types/enums";
import { mealReportFlow } from "./meal-report";
import { featIntro_MealsViaTextFlow } from "./meal-via-text";
import { reminderFlow } from "./reminders";
const Logger = logger("lib/processUserEngagement");

export const executeFlow = async (
  flowName: UserEngagementMessageTypesEnum,
  timezone: string
) => {
  switch (flowName) {
    case UserEngagementMessageTypesEnum.Reminder: {
      await reminderFlow(timezone);
      break;
    }
    case UserEngagementMessageTypesEnum.MealReport: {
      await mealReportFlow(timezone);
      break;
    }
    case UserEngagementMessageTypesEnum.FeatIntro_MealViaText: {
      await featIntro_MealsViaTextFlow(timezone);
      break;
    }
    default: {
      Logger("executeFlow").error(`Unknown flow: ${flowName as string}`);
    }
  }
};
