import { FilterQuery } from "mongoose";
import logger from "../config/logger";
import UserPreferences, {
  IUserPreferences,
  IUserPreferencesCreate,
} from "../models/userPreferences.model";
const Logger = logger("userPreferences.service");

export const createUserPreferences = async (
  userPreferences: IUserPreferencesCreate
): Promise<IUserPreferences> => {
  try {
    Logger("createUserPreferences").info("");
    const newUserPreference = await UserPreferences.create(userPreferences);
    return newUserPreference;
  } catch (error) {
    Logger("createUserPreferences").error(error);
    throw error;
  }
};

export const getUserPreferencesByUserId = async (
  userId: string
): Promise<IUserPreferences | null> => {
  try {
    Logger("getUserPreferencesByUserId").info("");
    const userPreferences = await UserPreferences.findOne({ user: userId });
    return userPreferences;
  } catch (error) {
    Logger("getUserPreferencesByUserId").error(error);
    throw error;
  }
};

export const getUserPreferencesByFilter = async (
  filter: FilterQuery<IUserPreferences>
): Promise<IUserPreferences[] | []> => {
  try {
    Logger("getUserPreferencesByFilter").info("");
    const userPreferences = await UserPreferences.find(filter);
    return userPreferences;
  } catch (error) {
    Logger("getUserPreferencesByFilter").error(error);
    throw error;
  }
};

export const updateUserPreferencesByUserId = async (
  userId: string,
  userPreferences: IUserPreferencesCreate
): Promise<IUserPreferences | null> => {
  try {
    Logger("updateUserPreferencesByUserId").info("");
    const updatedUserPreference = await UserPreferences.findOneAndUpdate(
      { user: userId },
      userPreferences,
      { new: true, runValidators: true }
    );
    return updatedUserPreference;
  } catch (error) {
    Logger("updateUserPreferencesByUserId").error(error);
    throw error;
  }
};
