import { USER_ENGAGEMENT_ALERT } from '../../../shared/config/config';
import logger from '../../../shared/config/logger';
import UserEngagementMessage from '../../../shared/models/userEngagementMessage.model';
import UserMeal from '../../../shared/models/userMeal.model';
import { userEngagementMessageTypesEnum } from '../../../shared/types/enums';
import { IUserWithLastMeal, IUserWithMeals } from '../../../shared/types/queueMessages';
import { objectifyId } from '../../../shared/utils/mongoose';
import User, { IUser } from './../../../shared/models/user.model';
const Logger = logger('lib/categorizeUsers');

export const categorizeUsers = async (usersWithoutEngagementMessage: IUser[], reminderThresholdDate: Date) => {
    Logger("categorizeUsers").debug("Categorizing users");

    const usersToEngage: (IUserWithMeals | IUserWithLastMeal)[] = [];

    // kept separate for less complexity and easy to debug
    const [usersToSendSummary, usersToSendReminders] = await Promise.all([
        getUsersToSendSummary(usersWithoutEngagementMessage, reminderThresholdDate),
        getUsersToSendReminders(usersWithoutEngagementMessage, reminderThresholdDate)
    ]);

    // merging both arrays to avoid further redundancy in while enqueueing
    usersToSendSummary.forEach(userToSendSummary => {
        usersToEngage.push({ user: userToSendSummary.user, meals: userToSendSummary.meals });
    });

    usersToEngage.push(...usersToSendReminders);

    return usersToEngage;
}

async function getUsersToSendSummary(usersWithoutEngagementMessage: IUser[], reminderThresholdDate: Date): Promise<IUserWithMeals[]> {
    Logger("getUsersToSendSummary").debug("Getting users to send summary");

    /**
     * 1. match users with their meals in past X days
     * 2. group user meals into single array
     * 3. extract user metaData from user Schema 
     */

    const userIds = usersWithoutEngagementMessage.map((user: IUser) => objectifyId(user.id));
    const usersToSendSummary = await UserMeal.aggregate([
        {
            $match: {
                user: { $in: userIds },
                createdAt: { $gte: reminderThresholdDate }
            }
        },
        {
            $group: {
                _id: "$user",
                meals: { $push: "$$ROOT" }
            }
        },
        {
            $lookup: {
                from: User.collection.name,
                localField: "_id",
                foreignField: "_id",
                as: "user"
            }
        },
        { $unwind: "$user" }
    ]);
    // Logger("getUsersToSendSummary").info(`${JSON.stringify(usersToSendSummary)}`);
    Logger("getUsersToSendSummary").info(`Found ${usersToSendSummary.length} Users to send summary`);

    return usersToSendSummary as IUserWithMeals[];
}

async function getUsersToSendReminders(usersWithoutEngagementMessage: IUser[], reminderThresholdDate: Date): Promise<IUserWithLastMeal[]> {
    Logger("getUsersToSendReminders").debug("Getting users to send reminders");

    /**
     * 1. match users and extract their meals & reminders
     * 2. check whether user haveMeal, lastMealDate, remindersCount
     * 3. final check based on either (zero mealCount or lastMealDate < reminderThresholdDate) and sentReminderCount < max_reminders
     */

    const userIds = usersWithoutEngagementMessage.map((user: IUser) => objectifyId(user.id));
    const usersToSendReminders = await User.aggregate([
        {
            $match: {
                _id: { $in: userIds }
            }
        },
        {
            $lookup: {
                from: UserEngagementMessage.collection.name,
                localField: "_id",
                foreignField: "user",
                as: "alerts"
            }
        },
        { // from UserMeal getting last meal of currentUser of pipeline
            $lookup: {
                from: UserMeal.collection.name,
                let: { userId: "$_id" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$user", "$$userId"] } } },
                    { $sort: { createdAt: -1 } },
                    { $limit: USER_ENGAGEMENT_ALERT.max_meal_for_reminder }
                ],
                as: "lastMeal"
            }
        },
        {
            $addFields: {
                lastMeal: { $arrayElemAt: ["$lastMeal", 0] },
                lastMealDate: { $arrayElemAt: ["$lastMeal.createdAt", 0] },
                remindersCount: {
                    $size: {
                        $filter: {
                            input: "$alerts",
                            as: "alert",
                            cond: {
                                $and: [
                                    { $eq: ["$$alert.type", userEngagementMessageTypesEnum.Reminder] },
                                    {
                                        $or: [
                                            { $eq: ["$lastMealDate", undefined] },
                                            { $gte: ["$$alert.createdAt", "$lastMealDate"] }
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        },
        {
            $match: {
                $and: [
                    {
                        $or: [
                            { lastMealDate: undefined },
                            { lastMealDate: { $lt: reminderThresholdDate } }
                        ]
                    },
                    { remindersCount: { $lt: USER_ENGAGEMENT_ALERT.max_reminders } }
                ]
            }
        },
        // Adding user data in a 'user' field for consistency as usersToSendSummary
        {
            $addFields: {
                user: "$$ROOT"
            }
        },
        {
            $project: {
                _id: 0,
                user: 1,
                lastMeal: { $ifNull: ["$lastMeal", undefined] }
            }
        }
    ]);

    Logger("getUsersToSendReminders").info(`${JSON.stringify(usersToSendReminders)}`);
    Logger("getUsersToSendReminders").info(`Found ${usersToSendReminders.length} Users to send reminders`);

    return usersToSendReminders as IUserWithLastMeal[];
}
