import logger from "../config/logger";
import { SETTINGS_SEED } from "../config/settings";
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

export const getSettingByKey = async (key: string) => {
  Logger("getSettingByKey").debug("");
  try {
    return await Setting.findOne({ key });
  } catch (error) {
    Logger("getSettingByKey").error(error);
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

export const seedSettings = async () => {
  Logger("seedSettings").debug("");
  try {
    const bulkOps = SETTINGS_SEED.map((setting) => ({
      updateOne: {
        filter: { key: setting.key },
        update: { $set: setting },
        upsert: true,
      },
    }));

    await Setting.bulkWrite(bulkOps);
  } catch (error) {
    Logger("seedSettings").error(error);
    throw error;
  }
};
