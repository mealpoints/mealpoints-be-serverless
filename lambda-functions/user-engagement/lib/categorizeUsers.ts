import logger from "../../../shared/config/logger";
import UserMeal from "../../../shared/models/userMeal.model";
import { UserEngagementMessageTypesEnum } from "../../../shared/types/enums";
import { IUserWithMeals } from "../../../shared/types/queueMessages";
import { objectifyId } from "../../../shared/utils/mongoose";
import User, { IUser } from "./../../../shared/models/user.model";
const Logger = logger("lib/categorizeUsers");

export const categorizeUsers = async (
  usersWithoutEngagementMessage: IUser[],
  reminderThresholdDate: Date
) => {
  Logger("categorizeUsers").debug("Categorizing users");

  const usersToEngage: (IUserWithMeals | IUsersToSendReminders)[] = [];

  // kept separate for less complexity and easy to debug
  const [usersToSendSummary, usersToSendReminders] = await Promise.all([
    getUsersToSendSummary(usersWithoutEngagementMessage, reminderThresholdDate),
    getUsersToSendReminders1(
      usersWithoutEngagementMessage,
      reminderThresholdDate
    ),
  ]);

  // merging both arrays to avoid further redundancy in while enqueueing
  usersToSendSummary.forEach((userToSendSummary) => {
    usersToEngage.push({
      user: userToSendSummary.user,
      meals: userToSendSummary.meals,
    });
  });

  usersToEngage.push(...usersToSendReminders);

  return usersToEngage;
};

async function getUsersToSendSummary(
  usersWithoutEngagementMessage: IUser[],
  reminderThresholdDate: Date
): Promise<IUserWithMeals[]> {
  Logger("getUsersToSendSummary").debug("Getting users to send summary");

  /**
   * 1. match users with their meals in past X days
   * 2. group user meals into single array
   * 3. extract user metaData from user Schema
   */

  const userIds = usersWithoutEngagementMessage.map((user: IUser) =>
    objectifyId(user.id)
  );
  const usersToSendSummary = await UserMeal.aggregate([
    {
      $match: {
        user: { $in: userIds },
        createdAt: { $gte: reminderThresholdDate },
      },
    },
    {
      $group: {
        _id: "$user",
        meals: { $push: "$$ROOT" },
      },
    },
    {
      $lookup: {
        from: User.collection.name,
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $addFields: {
        "user.id": "$user._id",
      },
    },
  ]);
  Logger("getUsersToSendSummary").info(
    `Found ${usersToSendSummary.length} Users to send summary`
  );

  return usersToSendSummary as IUserWithMeals[];
}

export interface IUsersToSendReminders {
  user: IUser;
  remindersCount: number;
}

async function getUsersToSendReminders1(
  usersWithoutEngagementMessage: IUser[],
  reminderThresholdDate: Date
): Promise<IUsersToSendReminders[]> {
  Logger("getUsersToSendReminders").info("");

  const userIds = usersWithoutEngagementMessage.map((user: IUser) =>
    objectifyId(user.id)
  );

  const usersToSendReminders = await User.aggregate([
    {
      $match: {
        _id: { $in: userIds },
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
        },
        remindersCount: { $size: "$reminders" },
      },
    },
  ]);

  return usersToSendReminders as IUsersToSendReminders[];
}
