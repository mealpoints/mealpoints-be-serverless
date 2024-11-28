import { connectToDatabase } from "../../shared/config/database";
import logger from "../../shared/config/logger";
import SettingsSingleton from "../../shared/config/settings";
import * as userService from "../../shared/services/user.service";
import { UserEngagementMessageTypesEnum } from "../../shared/types/enums";
import { executeFlow } from "./lib";
import { shouldExecute } from "./utils";
const Logger = logger("handler");

export const handler = async () => {
  Logger("UserEngagement").info("");
  try {
    await connectToDatabase();
    const settings = await SettingsSingleton.getInstance();
    const flows = settings.get("user-engagement.flows") as string[]; // Ex: ["welcome__09:00", "reminder__12:00"]

    const timezones = await userService.getAllTimezones();
    Logger("UserEngagement").info(
      `Identifed users in: ${timezones.join(", ")}`
    );

    for (const flow of flows) {
      const [name, time] = flow.split("__") as [
        UserEngagementMessageTypesEnum,
        string
      ];

      for (const timezone of timezones) {
        if (await shouldExecute(time, timezone)) {
          await executeFlow(name, timezone);
        }
      }
    }

    Logger("UserEngagement").info("Finished user engagement");
  } catch (error) {
    Logger("UserEngagement").error(error);
    throw error;
  }
};
