import { USER_MESSAGES } from "../../../../shared/config/config";
import logger from "../../../../shared/config/logger";
import { sendInternalAlert } from "../../../../shared/libs/internal-alerts";
import { IUser } from "../../../../shared/models/user.model";
import * as messageService from "../../../../shared/services/message.service";
import * as subscriptionService from "../../../../shared/services/subscription.service";
import {
  MessageTypesEnum,
  SubscriptionStatusEnum,
} from "../../../../shared/types/enums";
const Logger = logger("user-engagement/subscription-check");

export const processSubscriptionExpired = async (user: IUser) => {
  Logger("processSubscriptionExpired").info("");
  try {
    try {
      await subscriptionService.updateSubscription(
        {
          user: user.id,
          status: SubscriptionStatusEnum.Active,
        },
        {
          status: SubscriptionStatusEnum.Expired,
        }
      );
    } catch (error) {
      Logger("processSubscriptionExpired").error(
        `Failed to mark user subscription as expired`,
        JSON.stringify(error)
      );
      await sendInternalAlert({
        message: `Failed to mark subscription as expired for user with id ${user.id}`,
        severity: "major",
      });
      throw error;
    }
    await messageService.sendTextMessage({
      user: user.id,
      type: MessageTypesEnum.Text,
      payload: USER_MESSAGES.info.subscriptions.expired,
    });
  } catch (error) {
    Logger("processSubscriptionExpired").error(JSON.stringify(error));
    throw error;
  }
};
