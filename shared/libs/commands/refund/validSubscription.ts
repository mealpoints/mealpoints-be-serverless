import { USER_MESSAGES } from "../../../config/config";
import logger from "../../../config/logger";
import { ISubscription } from "../../../models/subscription.model";
import { IUser } from "../../../models/user.model";
import * as messageService from "../../../services/message.service";
import { MessageTypesEnum, SubscriptionStatusEnum } from "../../../types/enums";

const Logger = logger("shared/libs/commands/refund/validSubscription");

export const isValidSubscription = async (
  user: IUser,
  subscription: ISubscription | null
) => {
  Logger("isValidSubscription").info("");

  if (!subscription) {
    await handleNoSubscription(user);
    return false;
  }

  if (subscription.status === SubscriptionStatusEnum.Cancelled) {
    await handleCancelledSubscription(user);
    return false;
  }

  if (subscription.status === SubscriptionStatusEnum.Expired) {
    await handleExpiredSubscription(user);
    return false;
  }

  return true;
};

const handleNoSubscription = async (user: IUser) => {
  Logger("handleNoSubscription").info("User is not subscribed to any plan");
  await messageService.sendTextMessage({
    user: user.id,
    payload: USER_MESSAGES.errors.refund.user_not_subscribed,
    type: MessageTypesEnum.Text,
  });
};

const handleCancelledSubscription = async (user: IUser) => {
  Logger("handleCancelledSubscription").info(
    "User has already cancelled their subscription"
  );
  await messageService.sendTextMessage({
    user: user.id,
    payload: USER_MESSAGES.errors.refund.subscription_already_cancelled,
    type: MessageTypesEnum.Text,
  });
};

const handleExpiredSubscription = async (user: IUser) => {
  Logger("handleExpiredSubscription").info("User's subscription has expired");
  await messageService.sendTextMessage({
    user: user.id,
    payload: USER_MESSAGES.errors.refund.subscription_expired,
    type: MessageTypesEnum.Text,
  });
};
