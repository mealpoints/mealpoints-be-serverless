import { subDays } from "date-fns";
import logger from "../../../../shared/config/logger";
import SettingsSingleton from "../../../../shared/config/settings";
import User, { IUser } from "../../../../shared/models/user.model";
import * as userEngagementService from "../../../../shared/services/userEngagement.service";
import { UserEngagementMessageTypesEnum } from "../../../../shared/types/enums";
import { IUserToSendReminders } from "../../../../shared/types/queueMessages";
import { objectifyId } from "../../../../shared/utils/mongoose";
import { enqueueUsersToSendEngagement } from "../../services/enqueue.service";

const Logger = logger("user-engagement/reminders");

async function getUsersToSendReminders(
  usersWithoutEngagementMessage: IUser[],
  reminderThresholdDate: Date,
  timezone: string
): Promise<IUserToSendReminders[]> {
  Logger("getUsersToSendReminders").info("");

  const userIds = usersWithoutEngagementMessage.map((user: IUser) =>
    objectifyId(user.id)
  );

  const usersToSendReminders = await User.aggregate([
    {
      $match: {
        _id: { $in: userIds },
        timezone,
      },
    },
    {
      // Join UserMeal to get the latest meal for each user
      $lookup: {
        from: "usermeals",
        let: { userId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$user", "$$userId"] } } },
          { $sort: { createdAt: -1 } },
          { $limit: 1 },
        ],
        as: "lastMeal",
      },
    },
    {
      // Check if the user has no recent meal (older than 3 days or no meal at all)
      $match: {
        $or: [
          { lastMeal: { $size: 0 } }, // User has no meals
          { "lastMeal.createdAt": { $lt: reminderThresholdDate } }, // Last meal is older than 3 days
        ],
      },
    },
    {
      // Count the number of reminders sent to the user
      $lookup: {
        from: "userengagementmessages",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$user", "$$userId"] },
              type: UserEngagementMessageTypesEnum.Reminder,
            },
          },
        ],
        as: "reminders",
      },
    },
    {
      // Create a new field 'id' with the value of '_id'
      $addFields: {
        id: "$_id",
      },
    },
    {
      $project: {
        _id: 0, // Exclude _id field
        user: {
          id: "$id",
          firstName: "$firstName",
          lastName: "$lastName",
          contact: "$contact",
          email: "$email",
          isActive: "$isActive",
          createdAt: "$createdAt",
          updatedAt: "$updatedAt",
        },
        remindersCount: { $size: "$reminders" },
      },
    },
  ]);

  return usersToSendReminders as IUserToSendReminders[];
}

export const reminderFlow = async (timezone: string) => {
  Logger("reminderFlow").info(`Running reminder flow in ${timezone}`);
  try {
    const settings = await SettingsSingleton.getInstance();
    const engagmentMessageIntervalInDays = settings.get(
      "user-engagement.interval-in-days"
    ) as number;

    const reminderThresholdDate = subDays(
      new Date(),
      engagmentMessageIntervalInDays
    );

    const currentDate = new Date();

    // Get users who haven't recieved any engament message in the last X days in the timezone
    const usersWithoutEngagementMessage =
      await userEngagementService.getUsersWithoutEngagementMessagesInPeriod({
        startDate: reminderThresholdDate,
        endDate: currentDate,
        timezone,
      });

    const usersToSendReminders = await getUsersToSendReminders(
      usersWithoutEngagementMessage,
      reminderThresholdDate,
      timezone
    );

    Logger("reminderFlow").info(
      `Found ${usersToSendReminders.length} users to send reminders`
    );

    await enqueueUsersToSendEngagement(usersToSendReminders, "reminder");
  } catch (error) {
    Logger("reminderFlow").error(error);
    throw error;
  }
};
