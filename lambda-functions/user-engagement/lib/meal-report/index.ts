import { getDay, subDays } from "date-fns";
import logger from "../../../../shared/config/logger";
import { IUser } from "../../../../shared/models/user.model";
import UserMeal from "../../../../shared/models/userMeal.model";
import { UserEngagementMessageTypesEnum } from "../../../../shared/types/enums";
import { dayOfWeekAsString } from "../../../../shared/utils/DateUtils";
import { getTimeInTimezone } from "../../../../shared/utils/timezone";
import { enqueueUsersToSendEngagement } from "../../services/enqueue.service";

const Logger = logger("lib/processUserEngagement/meal-report");

export const mealReportFlow = async (timezone: string) => {
  Logger("mealReportFlow").info(`Running meal report flow in ${timezone}`);

  const timeInTimezone = getTimeInTimezone(new Date(), timezone);

  const dayOfWeek = dayOfWeekAsString(getDay(timeInTimezone));

  // Only run on Sundays
  if (dayOfWeek !== "Sunday") {
    Logger("mealReportFlow").info(
      `Not running meal report flow on ${dayOfWeek}`
    );
    return;
  }

  try {
    // Identify users who
    // 1. have logged meals in the last week.
    // 2. have not received a meal report in the last week.

    const oneWeekAgo = subDays(new Date(), 7);

    const aggregationPipeline = [
      {
        $match: {
          createdAt: { $gte: oneWeekAgo },
        },
      },
      {
        $group: {
          _id: "$user",
          lastMealLogged: { $max: "$createdAt" },
        },
      },
      {
        $lookup: {
          from: "userEngagementMessages",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$user", "$$userId"] },
                    { $gte: ["$createdAt", oneWeekAgo] },
                    {
                      $eq: ["$type", UserEngagementMessageTypesEnum.MealReport],
                    },
                  ],
                },
              },
            },
          ],
          as: "engagementMessages",
        },
      },
      {
        $match: {
          engagementMessages: { $eq: [] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $replaceRoot: { newRoot: "$user" },
      },
    ];

    const usersToSendMealReport: IUser[] = await UserMeal.aggregate(
      aggregationPipeline
    );

    Logger("mealReportFlow").info(
      `Found ${usersToSendMealReport.length} users to send meal report`
    );

    if (usersToSendMealReport.length === 0) return;

    // Enqueue users to generate meal report
    await enqueueUsersToSendEngagement(usersToSendMealReport, "meal_report");
  } catch (error) {
    Logger("mealReportFlow").error(error);
  }
};
