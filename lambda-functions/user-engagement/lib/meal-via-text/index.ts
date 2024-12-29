import { subDays } from "date-fns";
import logger from "../../../../shared/config/logger";
import SettingsSingleton from "../../../../shared/config/settings";
import User, { IUser } from "../../../../shared/models/user.model";
import { UserEngagementMessageTypesEnum } from "../../../../shared/types/enums";
import { enqueueUsersToSendEngagement } from "../../services/enqueue.service";
const Logger = logger("user-engagement/remind-meal-via-text");

async function getUsersForFeatIntro_MealViaText(
  timezone: string
): Promise<IUser[]> {
  Logger("getUsersForFeatIntro_MealViaText").info("");
  try {
    const settings = await SettingsSingleton.getInstance();
    const maxRemindToLogMealViaText = settings.get(
      "user-engagement.feat-intro.meal-via-text.max-reminders"
    ) as number;

    const usersToRemind = await User.aggregate([
      {
        $match: {
          timezone: timezone,
        },
      },
      // join UserMeals to get all meals of each user
      {
        $lookup: {
          from: "usermeals",
          localField: "_id",
          foreignField: "user",
          as: "meals",
        },
      },
      // join userengagementmessages to get all engagements sent to each user
      {
        $lookup: {
          from: "userengagementmessages",
          localField: "_id",
          foreignField: "user",
          as: "engagements",
        },
      },
      // calculate reminders sent about logging meal via text
      {
        $addFields: {
          reminderCount: {
            $size: {
              $filter: {
                input: "$engagements",
                as: "eng",
                cond: {
                  $eq: [
                    "$$eng.type",
                    UserEngagementMessageTypesEnum.FeatIntro_MealViaText,
                  ],
                },
              },
            },
          },
        },
      },
      {
        /**
         * filters users who have ::
         * 1. atleast one meal in last X days
         * 2. haven't logged any meal without image yet
         * 3. haven't received maxRemindToLogMealViaText
         */
        $match: {
          $and: [
            {
              meals: {
                $elemMatch: {
                  createdAt: { $gte: subDays(new Date(), 1) }, // last 1 day
                },
              },
            },
            {
              meals: {
                $not: {
                  $elemMatch: {
                    image: { $exists: false },
                  },
                },
              },
            },
            {
              reminderCount: { $lte: maxRemindToLogMealViaText },
            },
          ],
        },
      },
    ]);

    return usersToRemind;
  } catch (error) {
    Logger("getUsersForFeatIntro_MealViaText").error("%o", error);
    throw error;
  }
}

export const featIntro_MealsViaTextFlow = async (timezone: string) => {
  Logger("featIntro_MealsViaTextFlow").info(
    `Running feat-intro-meal-via-text flow in ${timezone}`
  );
  try {
    const usersToFeatIntro_MealViaText = await getUsersForFeatIntro_MealViaText(
      timezone
    );

    Logger("featIntro_MealsViaTextFlow").info(
      `Found ${usersToFeatIntro_MealViaText.length} users to send reminders`
    );
    await enqueueUsersToSendEngagement(
      usersToFeatIntro_MealViaText,
      "feat_intro_meal_via_text"
    );
  } catch (error) {
    Logger("featIntro_MealsViaTextFlow").error("%o", error);
    throw error;
  }
};
