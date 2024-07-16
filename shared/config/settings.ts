import { SettingKey, SettingValue } from "../models/setting.model";
import * as settingService from "../services/setting.service";

class Settings {
  private static instance: Settings;
  private settings: Map<string, SettingValue> = new Map();

  private constructor() {}

  public static async getInstance(): Promise<Settings> {
    if (!Settings.instance) {
      Settings.instance = new Settings();
      await Settings.instance.loadSettings();
    }
    return Settings.instance;
  }

  private async loadSettings(): Promise<void> {
    try {
      const settingsDocuments = await settingService.getSettings();
      settingsDocuments.forEach((document) => {
        this.settings.set(document.key, document.value);
      });
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  }

  public get(key: SettingKey): SettingValue | undefined {
    return this.settings.get(key);
  }
}

export default Settings;
