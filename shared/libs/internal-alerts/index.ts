import logger from "../../config/logger";
import SettingsSingleton from "../../config/settings";
import * as messageService from "../../services/message.service";
import { MessageTypesEnum } from "../../types/enums";

const Logger = logger("shared/libs/internal-alerts");

interface InternalAlert {
  message: string;
  severity: "minor" | "majoy" | "critical";
}

export const sendInternalAlert = async ({
  message,
  severity,
}: InternalAlert) => {
  Logger("sendInternalAlert").info(`${severity}: ${message}`);

  const settings = await SettingsSingleton.getInstance();
  const alertList = settings.get("internal-alerts.alert-list") as string[];

  alertList.forEach(async (userId) => {
    await messageService.sendTextMessage({
      user: userId,
      payload: `*Alert Level: ${severity}* 
      ${message}`,
      type: MessageTypesEnum.Text,
    });
  });
};
