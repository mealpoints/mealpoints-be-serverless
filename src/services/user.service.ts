import User, { IUser, IUserCreate } from "../models/user.model";

export const createUser = async (userData: IUserCreate): Promise<IUser> => {
  console.debug("[user.service/createUser]");
  const user = await User.create(userData);
  return user;
};

export const ensureUserByContact = async (contact: string): Promise<IUser> => {
  console.debug("[user.service/ensureUserByContact]");
  let user = await getUserByContact(contact);
  if (!user) {
    console.debug("[user.service/ensureUserByContact]");
    user = await createUser({ contact });
  }
  return user;
};

export const getUsers = async (): Promise<IUser[]> => {
  console.debug("[user.service/getUsers]");
  const users = await User.find();
  return users;
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  console.debug("[user.service/getUserById]");
  const user = await User.findById(id);
  return user;
};

export const getUserByContact = async (
  contact: string
): Promise<IUser | null> => {
  console.debug("[user.service/getUserByContact]");
  const user = await User.findOne({ contact });
  return user;
};

export const updateUser = async (
  id: string,
  userData: IUser
): Promise<IUser | undefined> => {
  console.debug("[user.service/updateUser]");
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
  console.debug("[user.service/deleteUser]");
  const user = await User.findByIdAndDelete(id);
  return user;
};
