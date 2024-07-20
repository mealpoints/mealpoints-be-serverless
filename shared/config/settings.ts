import { SettingKey, SettingValue } from "../models/setting.model";
import * as settingService from "../services/setting.service";
import logger from "./logger";

const Logger = logger("SettingsSingleton");

const NODE_ENV = process.env.NODE_ENV;

class SettingsSingleton {
  private static instance: SettingsSingleton;
  private settings: Map<string, SettingValue> = new Map();

  private constructor() {}

  public static async getInstance(): Promise<SettingsSingleton> {
    if (!SettingsSingleton.instance) {
      SettingsSingleton.instance = new SettingsSingleton();
      await SettingsSingleton.instance.loadSettings();
    }
    return SettingsSingleton.instance;
  }

  private async loadSettings(): Promise<void> {
    try {
      Logger("loadSettings").debug("Loading settings");
      const settingsDocuments = await settingService.getSettings();
      settingsDocuments.forEach((document) => {
        this.settings.set(document.key, document.value);
      });
    } catch (error) {
      Logger("loadSettings").error(error);
    }
  }

  private async getSetting(key: SettingKey): Promise<SettingValue> {
    const setting = await settingService.getSettingByKey(key);
    if (!setting) {
      throw new Error(`Setting with key ${key} not found`);
    }
    return setting.value;
  }

  public async get(key: SettingKey): Promise<SettingValue | undefined> {
    return NODE_ENV === "development"
      ? await this.getSetting(key)
      : this.settings.get(key);
  }
}

export default SettingsSingleton;
