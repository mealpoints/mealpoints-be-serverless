import logger from "../../config/logger";
import SettingsSingleton from "../../config/settings";
import { IConversation } from "../../models/conversation.model";
import * as conversationService from "../../services/conversation.service";
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
    const conversation = (await conversationService.getConversationByUserId(
      userId
    )) as IConversation;

    await messageService.sendTextMessage({
      user: userId,
      conversation: conversation.id,
      payload: `*Alert Level: ${severity}* 
      ${message}`,
      type: MessageTypesEnum.Text,
    });
  });
};
