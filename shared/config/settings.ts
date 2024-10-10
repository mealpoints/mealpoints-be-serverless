import { SettingKey, SettingValue } from "../models/setting.model";
import * as settingService from "../services/setting.service";
import logger from "./logger";

const Logger = logger("SettingsSingleton");

class SettingsSingleton {
  private static instance: SettingsSingleton;
  private settings: Map<SettingKey, SettingValue> = new Map();

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

  public get(key: SettingKey) {
    return this.settings.get(key);
  }
}

export default SettingsSingleton;
