import logger from "../config/logger";
import User, { IUser } from "../models/user.model";
import UserEngagementMessage, {
  IUserEngagementMessage,
  IUserEngagementMessageCreate,
} from "../models/userEngagementMessage.model";
import { UserEngagementMessageTypesEnum } from "../types/enums";
const Logger = logger("userEngagement.service");

interface IGetUsersWithoutEngagementMessagesInPeriod {
  startDate: Date;
  endDate: Date;
  timezone?: string;
  type?: UserEngagementMessageTypesEnum;
}

export const getUsersWithoutEngagementMessagesInPeriod = async ({
  startDate,
  endDate,
  timezone,
  type,
}: IGetUsersWithoutEngagementMessagesInPeriod): Promise<IUser[]> => {
  Logger("getUsersWithoutEngagementMessagesInPeriod").info(
    `Getting users in ${timezone}  without engagement messages in period`
  );
  /**
   * 1. get all the users who have engagementMessages in last X days
   * 2. filter them from Users model to get the users who have not received any engagement messages
   */
  const engagedUsers = await UserEngagementMessage.distinct("user", {
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
    type,
  });

  // TODO: Use the user service. Do not use the User model directly
  const usersWithoutEngagement = await User.find({
    _id: {
      $nin: engagedUsers,
    },
    timezone,
  });
  Logger("getUsersWithoutEngagementMessagesInPeriod").debug(
    `Users without engagement: ${usersWithoutEngagement.length}`
  );
  return usersWithoutEngagement;
};

export const createUserEngagementMessage = async (
  engagementMessage: IUserEngagementMessageCreate
): Promise<IUserEngagementMessage> => {
  try {
    Logger("createUserEngagementMessage").info("");
    const newEngagementMessage = await UserEngagementMessage.create(
      engagementMessage
    );
    return newEngagementMessage;
  } catch (error) {
    Logger("createUserEngagementMessage").error(error);
    throw error;
  }
};
