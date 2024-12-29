import { subDays } from "date-fns";
import logger from "../../../../shared/config/logger";
import SettingsSingleton from "../../../../shared/config/settings";
import User, { IUser } from "../../../../shared/models/user.model";
import * as userEngagementService from "../../../../shared/services/userEngagement.service";
import { UserEngagementMessageTypesEnum } from "../../../../shared/types/enums";
import { objectifyId } from "../../../../shared/utils/mongoose";
import { enqueueUsersToSendEngagement } from "../../services/enqueue.service";
const Logger = logger("user-engagement/remind-meal-via-text");

async function filterUsersForFeatIntro_MealViaText(
  usersWithoutMealViaTextEngagements: IUser[]
): Promise<IUser[]> {
  Logger("filterUsersForFeatIntro_MealViaText").info("");
  try {
    const userIds = usersWithoutMealViaTextEngagements.map((user: IUser) =>
      objectifyId(user.id)
    );
    const settings = await SettingsSingleton.getInstance();
    const noMealInDays = settings.get(
      "user-engagement.feat-intro.meal-via-text.no-meals-in-days"
    ) as number;
    const maxRemindToLogMealViaText = settings.get(
      "user-engagement.feat-intro.meal-via-text.max-reminders"
    ) as number;
    const lastMealThresholdDate = subDays(new Date(), noMealInDays);

    const usersToRemind = await User.aggregate([
      {
        $match: {
          _id: { $in: userIds },
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
         * 1. no meal in last X days
         * 2. haven't logged any meal without image yet
         * 3. haven't received maxRemindToLogMealViaText
         */
        $match: {
          meals: {
            $not: {
              $elemMatch: {
                createdAt: { $gte: lastMealThresholdDate },
                image: { $exists: false },
              },
            },
          },
          reminderCount: { $lt: maxRemindToLogMealViaText },
        },
      },
    ]);

    return usersToRemind;
  } catch (error) {
    Logger("filterUsersForFeatIntro_MealViaText").error("%o", error);
    throw error;
  }
}

export const featIntro_MealsViaTextFlow = async (timezone: string) => {
  Logger("featIntro_MealsViaTextFlow").info(
    `Running feat-intro-meal-via-text flow in ${timezone}`
  );
  try {
    const settings = await SettingsSingleton.getInstance();
    const remindIntervalInDays = settings.get(
      "user-engagement.feat-intro.meal-via-text.interval-in-days"
    ) as number;

    const remindThresholdDate = subDays(new Date(), remindIntervalInDays);

    const usersWithoutMealViaTextEngagement =
      await userEngagementService.getUsersWithoutEngagementMessagesInPeriod({
        startDate: remindThresholdDate,
        endDate: new Date(),
        timezone,
        type: UserEngagementMessageTypesEnum.FeatIntro_MealViaText,
      });

    const usersToFeatIntro_MealViaText =
      await filterUsersForFeatIntro_MealViaText(
        usersWithoutMealViaTextEngagement
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
