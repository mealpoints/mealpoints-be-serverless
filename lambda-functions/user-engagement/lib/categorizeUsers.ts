import { USER_ENGAGEMENT_ALERT } from '../../../shared/config/config';
import logger from '../../../shared/config/logger';
import UserEngagementMessage from '../../../shared/models/userEngagementMessage.model';
import UserMeal from '../../../shared/models/userMeal.model';
import { userEngagementMessageTypesEnum } from '../../../shared/types/enums';
import User, { IUser } from './../../../shared/models/user.model';
const Logger = logger('lib/categorizeUsers');

export const categorizeUsers = async (usersWithoutEngagementAlerts: IUser[], dateMinusEngagementInterval: Date) => {
    Logger("categorizeUsers").debug("Categorizing users");

    // TODO: a single aggregation function to return both usersToSendSummary and usersToSendReminders
    const usersToSendSummary = await getUsersToSendSummary(usersWithoutEngagementAlerts, dateMinusEngagementInterval);
    const usersToSendReminders = await getUsersToSendReminders(usersWithoutEngagementAlerts, dateMinusEngagementInterval);

    return {
        usersToSendSummary,
        usersToSendReminders,
    };
}

async function getUsersToSendSummary(usersWithoutEngagementAlerts: IUser[], dateMinusEngagementInterval: Date) {
    Logger("getUsersToSendSummary").debug("Getting users to send summary");

    const usersToSendSummary = await UserMeal.aggregate([
        {
            $match: {
                user: { $in: usersWithoutEngagementAlerts.map(user => user.id) },
                createdAt: { $gte: dateMinusEngagementInterval }
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

    return usersToSendSummary;
}

async function getUsersToSendReminders(usersWithoutEngagementAlerts: IUser[], dateMinusEngagementInterval: Date) {
    Logger("getUsersToSendReminders").debug("Getting users to send reminders");

    const usersToSendReminders = await UserMeal.aggregate([
        {
            $match: {
                user: { $in: usersWithoutEngagementAlerts.map(user => user.id) }
            }
        },
        {
            $group: {
                _id: "$user",
                lastMealDate: { $max: "$createdAt" }
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
            $addFields: {
                remindersAfterLastMeal: {
                    $filter: {
                        input: "$alerts",
                        as: "alert",
                        cond: {
                            $and: [
                                { $eq: ["$$alert.type", userEngagementMessageTypesEnum.Reminder] },
                                { $gte: ["$$alert.createdAt", "$lastMealDate"] }
                            ]
                        }
                    }
                }
            }
        },
        {
            $addFields: {
                remindersCount: { $size: "$remindersAfterLastMeal" }
            }
        },
        {
            $match: {
                lastMealDate: { $lt: dateMinusEngagementInterval },
                remindersCount: { $lt: USER_ENGAGEMENT_ALERT.max_reminders }
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
        { $unwind: "$user" },
        {
            $project: {
                user: 1 // Only projecting user info, as meals aren't needed for reminder
            }
        }
    ]);

    return usersToSendReminders.map(u => u.user);
}
