import logger from "../config/logger";
import User, { IUser, IUserCreate } from "../models/user.model";
import { getGeoInfoFromcontact } from "../utils/timezone";
const Logger = logger("user.service");

export const createUser = async (userData: IUserCreate): Promise<IUser> => {
  Logger("createUser").info("");

  const { countryCode, timezone } = await getGeoInfoFromcontact(
    userData.contact
  );
  userData.timezone ??= timezone;
  userData.countryCode ??= countryCode;

  const user = await User.create(userData);
  return user;
};

export const ensureUserByContact = async (contact: string): Promise<IUser> => {
  Logger("ensureUserByContact").info("");
  let user = await getUserByContact(contact);
  if (!user) {
    Logger("ensureUserByContact").info("");
    user = await createUser({ contact });
  }
  return user;
};

export const getUsers = async (): Promise<IUser[]> => {
  Logger("getUsers").info("");
  const users = await User.find();
  return users;
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  Logger("getUserById").info("");
  const user = await User.findById(id);
  return user;
};

export const getUserByContact = async (
  contact: string
): Promise<IUser | null> => {
  Logger("getUserByContact").info("");
  const user = await User.findOne({ contact });
  return user;
};

export const updateUser = async (
  id: string,
  userData: IUser
): Promise<IUser | undefined> => {
  Logger("updateUser").info("");
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
  Logger("deleteUser").info("");
  const user = await User.findByIdAndUpdate(id, { isActive: false });
  return user;
};

export const getAllTimezones = async (): Promise<string[]> => {
  try {
    Logger("getAllTimezones").info("");
    const timezones = await User.distinct("timezone");
    return timezones;
  } catch (error) {
    Logger("getAllTimezones").error(error);
    throw error;
  }
};
