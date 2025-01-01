import logger from "../../shared/config/logger";
import { ISetting, SettingValue } from "../../shared/models/setting.model";
import { ISubscription } from "../../shared/models/subscription.model";
import { IUser } from "../../shared/models/user.model";
import * as settingService from "../../shared/services/setting.service";
import * as subscriptionSerice from "../../shared/services/subscription.service";
import * as userService from "../../shared/services/user.service";
const Logger = logger("test/test_utils/DataService");

export class DataService {
  private static instance: DataService;
  private _user: IUser | undefined = undefined;
  private _settings: Map<string, SettingValue> = new Map();
  private _subscription: ISubscription | null = null;

  // Private constructor to prevent direct instantiation
  private constructor() {}

  // Public method to get the singleton instance
  public static getInstance(): DataService {
    if (!DataService.instance) {
      Logger("getInstance").info("Creating new instance of DataService");
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  public async seed(contact: string): Promise<void> {
    try {
      await this.fetchUserById(contact);
      await this.fetchSettings();
      await this.fetchSubscription();
    } catch (error) {
      Logger("seed").error(error);
      throw error;
    }
  }

  // Fetch user details from the database by ID and store it in the instance
  public async fetchUserById(contact: string): Promise<void> {
    try {
      const user = await userService.getUserByContact(contact);
      if (user) {
        this._user = user;
        Logger("fetchUserById").info(
          `User with contact number ${contact} fetched successfully.`
        );
      } else {
        throw new Error(`User with contact number ${contact} not found.`);
      }
    } catch (error) {
      Logger("fetchUserById").error(error);
      throw error;
    }
  }

  // Fetch settings from the database and store them in the instance
  public async fetchSettings(): Promise<void> {
    try {
      // Fetch settings from the database
      const settingsArray = await settingService.getSettings();
      settingsArray.forEach((setting: ISetting) => {
        this._settings.set(setting.key, setting.value);
      });

      Logger("fetchSettings").info("Settings fetched successfully.");
    } catch (error) {
      Logger("fetchSettings").error(error);
      throw error;
    }
  }

  // Get the subscription details of the user
  public async fetchSubscription() {
    try {
      const subscription = await subscriptionSerice.getSubscriptionByUserId(
        this._user?.id as string
      );
      this._subscription = subscription;
    } catch (error) {
      Logger("getSubscription").error(error);
      throw error;
    }
  }

  // Get the stored user details
  public getUser(): IUser {
    return this._user as IUser;
  }

  // Get the stored settings
  public getSettings() {
    return this._settings;
  }

  public getSubscription() {
    return this._subscription;
  }

  get user(): IUser {
    return this._user as IUser;
  }

  get settings() {
    return this._settings;
  }

  get subscription() {
    return this._subscription;
  }
}
