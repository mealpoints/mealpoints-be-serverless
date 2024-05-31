import User, { IUser, IUserCreate } from "../models/user.model";

export const createUser = async (userData: IUserCreate): Promise<IUser> => {
  console.debug("user.service: Creating user");
  const user = await User.create(userData);
  return user;
};

export const getUsers = async (): Promise<IUser[]> => {
  console.debug("user.service: Getting users");
  const users = await User.find();
  return users;
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  console.debug("user.service: Getting user by ID");
  const user = await User.findById(id);
  return user;
};

export const getUserByContact = async (
  contact: string
): Promise<IUser | null> => {
  console.debug("user.service: Getting user by contact");
  const user = await User.findOne({ contact });
  return user;
};

export const updateUser = async (
  id: string,
  userData: IUser
): Promise<IUser | null> => {
  console.debug("user.service: Updating user");
  const user = await User.findById(id).then((user) => {
    if (!user) {
      return null;
    }
    user.set(userData);
    return user.save();
  });
  return user;
};

export const deleteUser = async (id: string): Promise<IUser | null> => {
  console.debug("user.service: Deleting user");
  const user = await User.findByIdAndDelete(id);
  return user;
};
