import { USER_ENGAGEMENT_ALERT } from '../../../shared/config/config';
import logger from '../../../shared/config/logger';
import UserEngagementMessage from '../../../shared/models/userEngagementMessage.model';
import UserMeal from '../../../shared/models/userMeal.model';
import { userEngagementMessageTypesEnum } from '../../../shared/types/enums';
import { IUserWithMeals } from '../../../shared/types/queueMessages';
import { objectifyId } from '../../../shared/utils/mongoose';
import User, { IUser } from './../../../shared/models/user.model';
const Logger = logger('lib/categorizeUsers');

export const categorizeUsers = async (usersWithoutEngagementMessage: IUser[], reminderThresholdDate: Date) => {
    Logger("categorizeUsers").debug("Categorizing users");

    // TODO: a single aggregation function to return both usersToSendSummary and usersToSendReminders
    const [usersToSendSummary, usersToSendReminders] = await Promise.all([
        getUsersToSendSummary(usersWithoutEngagementMessage, reminderThresholdDate),
        getUsersToSendReminders(usersWithoutEngagementMessage, reminderThresholdDate)
    ]);

    return {
        usersToSendSummary,
        usersToSendReminders,
    };
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
    Logger("getUsersToSendSummary").debug(`Users to send summary: ${JSON.stringify(usersToSendSummary, undefined, 2)}`);
    Logger("getUsersToSendSummary").info(`Found ${usersToSendSummary.length} Users to send summary`);

    return usersToSendSummary as IUserWithMeals[];
}

async function getUsersToSendReminders(usersWithoutEngagementMessage: IUser[], reminderThresholdDate: Date): Promise<IUser[]> {
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
        {
            $lookup: {
                from: UserMeal.collection.name,
                localField: "_id",
                foreignField: "user",
                as: "meals"
            }
        },
        {
            $addFields: {
                haveMeals: { $gt: [{ $size: "$meals" }, 0] },
                lastMealDate: { $max: "$meals.createdAt" },
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
                            { haveMeals: false },
                            { lastMealDate: { $lt: reminderThresholdDate } }
                        ]
                    },
                    { remindersCount: { $lt: USER_ENGAGEMENT_ALERT.max_reminders } }
                ]
            }
        }
    ]);

    Logger("getUsersToSendReminders").debug(`Users to send reminders: ${JSON.stringify(usersToSendReminders, undefined, 2)}`);
    Logger("getUsersToSendReminders").info(`Found ${usersToSendReminders.length} Users to send reminders`);

    return usersToSendReminders as IUser[];
}
