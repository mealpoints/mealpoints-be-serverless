import logger from "../config/logger";
import Setting, { ISettingCreate } from "../models/setting.model";

const Logger = logger("shared/setting.service");

export const getSettings = async () => {
  Logger("getSettings").debug("");
  try {
    return await Setting.find();
  } catch (error) {
    Logger("getSettings").error(error);
    throw error;
  }
};

export const createSetting = async ({ key, value }: ISettingCreate) => {
  Logger("createSetting").debug("");
  try {
    await Setting.create({ key, value });
  } catch (error) {
    Logger("createSetting").error(error);
    throw error;
  }
};

export const updateSetting = async ({ key, value }: ISettingCreate) => {
  Logger("updateSetting").debug("");
  try {
    await Setting.findOneAndUpdate({ key }, { value }).exec();
  } catch (error) {
    Logger("updateSetting").error(error);
    throw error;
  }
};
