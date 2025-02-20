import logger from "../../../shared/config/logger";
import { UserEngagementMessageTypesEnum } from "../../../shared/types/enums";
import { bldReminders } from "./bld-reminders";
import { mealReportFlow } from "./meal-report";
import { featIntro_MealsViaTextFlow } from "./meal-via-text";
import { reminderFlow } from "./reminders";
import { subscriptionCheckFlow } from "./subscription-check";
const Logger = logger("lib/processUserEngagement");

export const executeFlow = async (
  flowName: UserEngagementMessageTypesEnum,
  timezone: string
) => {
  try {
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
      case UserEngagementMessageTypesEnum.SubscriptionCheck: {
        await subscriptionCheckFlow(timezone);
        break;
      }
      case UserEngagementMessageTypesEnum.BFReminder:
      case UserEngagementMessageTypesEnum.LunchReminder:
      case UserEngagementMessageTypesEnum.DinnerReminder: {
        await bldReminders(flowName, timezone);
        break;
      }
      default: {
        throw new Error(`Unknown flow: ${flowName as string}`);
      }
    }
  } catch (error) {
    Logger("executeFlow").error(
      `Flow execution failed for ${flowName as string}: ${JSON.stringify(
        error
      )}`
    );
    throw error;
  }
};
