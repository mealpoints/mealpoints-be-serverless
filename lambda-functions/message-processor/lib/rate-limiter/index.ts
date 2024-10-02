import * as config from "../../../../shared/config/config";
import logger from "../../../../shared/config/logger";
import * as messageService from "../../../../shared/services/message.service";
import { DateUtils } from "../../../../shared/utils/DateUtils";
const Logger = logger("rate-limiter");

export const isUserRateLimited = async (userId: string) => {
  try {
    Logger("isUserRateLimited").debug("");
    const messageCount = await messageService.messageCountByUserPerPeriod(
      userId,
      new DateUtils().subtractDays(1).toDate(),
      new Date()
    );

    if (messageCount <= config.MESSAGE_LIMIT_PER_DAY) {
      Logger("isUserRateLimited").debug(
        "User has exceeded the limit of messages per day"
      );

      return true;
    }

    return false;
  } catch (error) {
    Logger("isUserRateLimited").error(error);
    throw error;
  }
};
