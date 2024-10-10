import * as config from "../../../../shared/config/config";
import logger from "../../../../shared/config/logger";
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

    // Ratelimit only in PROD
    if (process.env.NODE_ENV !== "production") {
      Logger("isUserRateLimited").info(
        "Rate limiting is disabled in non-prod environments"
      );
      return false;
    }

    // Check if the user is exempt from rate limiting
    if (config.RATE_LIMITER.exempt_users.includes(user.id)) {
      Logger("isUserRateLimited").info("User is exempt from rate limiting");
      return false;
    }

    // Get the number of messages sent by the user in the last 24 hours
    const messageCount = await messageService.messageCountByUserPerPeriod(
      user.id,
      new DateUtils().subtractDays(1).toDate(),
      new Date()
    );

    if (messageCount >= config.RATE_LIMITER.message_limit_per_day) {
      Logger("isUserRateLimited").info(
        "User has exceeded the limit of messages per day"
      );

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
