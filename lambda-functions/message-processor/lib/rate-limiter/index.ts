import * as config from "../../../../shared/config/config";
import logger from "../../../../shared/config/logger";
import SettingsSingleton from "../../../../shared/config/settings";
import * as internalAlerts from "../../../../shared/libs/internal-alerts";
import { IConversation } from "../../../../shared/models/conversation.model";
import { IUser } from "../../../../shared/models/user.model";
import * as messageService from "../../../../shared/services/message.service";
import { MessageTypesEnum } from "../../../../shared/types/enums";
import { DateUtils } from "../../../../shared/utils/DateUtils";
const Logger = logger("rate-limiter");

export const isUserRateLimited = async (
  user: IUser,
  conversation: IConversation
) => {
  try {
    Logger("isUserRateLimited").info("");
    const settings = await SettingsSingleton.getInstance();
    const messageLimit = settings.get(
      "rate-limit.message-limit-per-day"
    ) as number;

    // Get the number of messages sent by the user in the last 24 hours
    const messageCount = await messageService.messageCountByUserPerPeriod(
      user.id,
      new DateUtils().subtractDays(1).toDate(),
      new Date()
    );

    Logger("isUserRateLimited").info(
      `Message count: ${messageCount} / ${messageLimit}`
    );

    if (messageCount >= messageLimit) {
      Logger("isUserRateLimited").info(
        "User has exceeded the limit of messages per day"
      );

      await internalAlerts.sendInternalAlert({
        message: `
        ${user.contact} has been rate-limited. 
        Message count: ${messageCount} / ${messageLimit}
        `,
        severity: "minor",
      });

      await messageService.sendTextMessage({
        user: user.id,
        conversation: conversation.id,
        payload: config.USER_MESSAGES.errors.rate_limit_exceeded,
        type: MessageTypesEnum.Text,
      });

      return true;
    }

    return false;
  } catch (error) {
    Logger("isUserRateLimited").error(error);
    // We intentionally do not throw the error here, as we want to allow the message to be processed
    return false;
  }
};
