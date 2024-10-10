import logger from "../config/logger";
import Setting, { ISettingCreate } from "../models/setting.model";

const Logger = logger("shared/setting.service");

export const getSettings = async () => {
  Logger("getSettings").info("");
  try {
    return await Setting.find();
  } catch (error) {
    Logger("getSettings").error(error);
    throw error;
  }
};

export const getSettingByKey = async (key: string) => {
  Logger("getSettingByKey").info(key);
  try {
    return await Setting.findOne({ key });
  } catch (error) {
    Logger("getSettingByKey").error(error);
    throw error;
  }
};

export const createSetting = async ({ key, value }: ISettingCreate) => {
  Logger("createSetting").info("");
  try {
    return await Setting.create({ key, value });
  } catch (error) {
    Logger("createSetting").error(error);
    throw error;
  }
};

export const updateSetting = async ({ key, value }: ISettingCreate) => {
  Logger("updateSetting").info("");
  try {
    await Setting.findOneAndUpdate({ key }, { value }).exec();
  } catch (error) {
    Logger("updateSetting").error(error);
    throw error;
  }
};

export const deleteSetting = async (key: string) => {
  Logger("deleteSetting").info("");
  try {
    await Setting.findOneAndDelete({ key }).exec();
  } catch (error) {
    Logger("deleteSetting").error(error);
    throw error;
  }
};
