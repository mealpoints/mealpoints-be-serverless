import { subDays, subHours } from "date-fns";
import logger from "../../../../shared/config/logger";
import User from "../../../../shared/models/user.model";
import { IUserWithBLDReminderType } from "../../../../shared/types/queueMessages";
import { enqueueUsersToSendEngagement } from "../../services/enqueue.service";
const Logger = logger("user-engagement/bld-reminders");

async function getUsersForBldReminders(
  flowName: string,
  timezone: string
): Promise<IUserWithBLDReminderType[]> {
  Logger("getUsersForBldReminders").info("");
  try {
    const threeDaysAgo = subDays(new Date(), 3);
    const twoHoursAgo = subHours(new Date(), 2);
    const usersForBLDReminder = await User.aggregate([
      {
        $match: {
          timezone: timezone,
        },
      },
      // Ensure the user has a nutrition budget set
      {
        $lookup: {
          from: "nutritionbudgets",
          localField: "_id",
          foreignField: "user",
          as: "nutritionBudget",
        },
      },
      {
        $match: {
          nutritionBudget: { $ne: [] },
        },
      },
      // join UserMeals to get & inspect their meals
      {
        $lookup: {
          from: "usermeals",
          localField: "_id",
          foreignField: "user",
          as: "meals",
        },
      },
      // Filter users who:
      // 1. Logged at least one meal in the last 3 days
      // 2. Have not logged any meal in the last 2 hours
      {
        $match: {
          $and: [
            {
              meals: {
                $elemMatch: { createdAt: { $gte: threeDaysAgo } },
              },
            },
            {
              meals: {
                $not: {
                  $elemMatch: { createdAt: { $gte: twoHoursAgo } },
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          id: { $toString: "$_id" },
          bldReminderType: flowName,
        },
      },
    ]);

    return usersForBLDReminder;
  } catch (error) {
    Logger("getUsersForBldReminders").error(JSON.stringify(error));
    throw error;
  }
}

export const bldReminders = async (flowName: string, timezone: string) => {
  Logger("bldReminders").info(`Running bldReminders flow in ${timezone}`);
  try {
    const usersForBLDReminder = await getUsersForBldReminders(
      flowName,
      timezone
    );

    Logger("bldReminders").info(
      `Found ${usersForBLDReminder.length} users to send ${flowName} reminder`
    );

    await enqueueUsersToSendEngagement(usersForBLDReminder, "bld_reminder");
  } catch (error) {
    Logger("bldReminders").error(JSON.stringify(error));
    throw error;
  }
};
