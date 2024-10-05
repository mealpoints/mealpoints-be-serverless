import { subHours } from "date-fns";
import logger from "../config/logger";
import User, { IUser, IUserCreate } from "../models/user.model";
import UserEngagementAlert from "../models/userEngagement.model";
const Logger = logger("user.service");

export const createUser = async (userData: IUserCreate): Promise<IUser> => {
  Logger("createUser").debug("");
  const user = await User.create(userData);
  return user;
};

export const ensureUserByContact = async (contact: string): Promise<IUser> => {
  Logger("ensureUserByContact").debug("");
  let user = await getUserByContact(contact);
  if (!user) {
    Logger("ensureUserByContact").debug("");
    user = await createUser({ contact });
  }
  return user;
};

export const getUsers = async (): Promise<IUser[]> => {
  Logger("getUsers").debug("");
  const users = await User.find();
  return users;
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  Logger("getUserById").debug("");
  const user = await User.findById(id);
  return user;
};

export const getUserByContact = async (
  contact: string
): Promise<IUser | null> => {
  Logger("getUserByContact").debug("");
  const user = await User.findOne({ contact });
  return user;
};

export const getUsersByLastSummarySentAt = async (interval: number): Promise<IUser[]> => {
  Logger("getUsersByLastSummarySentAt").debug("");
  const thresholdDate = subHours(new Date(), interval);
  return await User.find({
    lastSummarySentAt: { $lt: thresholdDate },
  });
};

export const updateUser = async (
  id: string,
  userData: IUser
): Promise<IUser | undefined> => {
  Logger("updateUser").debug("");
  const user = await User.findById(id).then((user) => {
    if (!user) {
      return;
    }
    user.set(userData);
    return user.save();
  });
  return user;
};

export const deleteUser = async (id: string): Promise<IUser | null> => {
  Logger("deleteUser").debug("");
  const user = await User.findByIdAndUpdate(id, { isActive: false });
  return user;
};

export const getUsersWithoutEngagementAlertsInPeriod = async (
  startDate: Date,
  endDate: Date
): Promise<IUser[]> => {
  Logger("getUsersWithoutEngagementAlertsInPeriod").debug("");

  const engagedUsers = await UserEngagementAlert.distinct('user', {
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  });

  const usersWithoutEngagement = await User.find({
    _id: {
      $nin: engagedUsers
    }
  });

  return usersWithoutEngagement;
};
