import { SettingKey, SettingValue } from "../models/setting.model";
import * as settingService from "../services/setting.service";
import logger from "./logger";

const Logger = logger("SettingsSingleton");

class SettingsSingleton {
  private static instance: SettingsSingleton;
  private settings: Map<SettingKey, SettingValue> = new Map();
  private lastLoadTime: number = 0;
  private readonly settingsExpiryTime: number = 2 * 60 * 1000; // 2 minutes

  private constructor() {}

  private isCacheExpired(): boolean {
    return Date.now() - this.lastLoadTime > this.settingsExpiryTime;
  }

  public static async getInstance(): Promise<SettingsSingleton> {
    if (!SettingsSingleton.instance) {
      SettingsSingleton.instance = new SettingsSingleton();
      await SettingsSingleton.instance.loadSettings();
    } else if (SettingsSingleton.instance.isCacheExpired()) {
      await SettingsSingleton.instance.loadSettings();
    }
    return SettingsSingleton.instance;
  }

  private async loadSettings(): Promise<void> {
    try {
      Logger("loadSettings").info("Loading settings");
      const settingsDocuments = await settingService.getSettings();
      settingsDocuments.forEach((document) => {
        this.settings.set(document.key, document.value);
      });
    } catch (error) {
      Logger("loadSettings").error(error);
    }
  }

  public get(key: SettingKey) {
    return this.settings.get(key);
  }
}

export default SettingsSingleton;
