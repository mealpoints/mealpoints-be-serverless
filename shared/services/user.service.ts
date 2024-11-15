import logger from "../config/logger";
import User, { IUser, IUserCreate } from "../models/user.model";
import { getTimeZoneFromcontact } from "../utils/Timezone";
const Logger = logger("user.service");

export const createUser = async (userData: IUserCreate): Promise<IUser> => {
  Logger("createUser").info("");
  const user = await User.create(userData);
  return user;
};

export const ensureUserByContact = async (contact: string): Promise<IUser> => {
  Logger("ensureUserByContact").info("");
  let user = await getUserByContact(contact);
  if (!user) {
    const timezone = await getTimeZoneFromcontact(contact);
    user = await createUser({ contact, timezone });
  } else if (!user.timezone) {
    // FIXME: find any better place to update this info?
    user.timezone = await getTimeZoneFromcontact(contact);
    await user.save();
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

