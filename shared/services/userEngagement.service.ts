import logger from "../config/logger";
import User, { IUser } from "../models/user.model";
import UserEngagementMessage from "../models/userEngagementMessage.model";
const Logger = logger("userEngagement.service");

export const getUsersWithoutEngagementMessagesInPeriod = async (startDate: Date, endDate: Date): Promise<IUser[]> => {
    Logger("getUsersWithoutEngagementMessagesInPeriod").debug("");
    /**
     * 1. get all the users who have engagementMessages in last X days
     * 2. filter them from Users model to get the users who have not received any engagement messages
     */
    const engagedUsers = await UserEngagementMessage.distinct('user', {
        createdAt: {
            $gte: startDate,
            $lte: endDate,
        },
    });
    Logger("getUsersWithoutEngagementMessagesInPeriod").debug(`Engaged users: ${engagedUsers.length}`);
    const usersWithoutEngagement = await User.find({
        _id: {
            $nin: engagedUsers
        }
    });
    Logger("getUsersWithoutEngagementMessagesInPeriod").debug(`Users without engagement: ${usersWithoutEngagement.length}`);
    return usersWithoutEngagement;
}