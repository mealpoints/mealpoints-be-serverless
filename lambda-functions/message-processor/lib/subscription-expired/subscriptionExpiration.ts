import { USER_MESSAGES } from "../../../../shared/config/config";
import logger from "../../../../shared/config/logger";
import { sendInternalAlert } from "../../../../shared/libs/internal-alerts";
import { IPlan } from "../../../../shared/models/plan.model";
import * as messageService from "../../../../shared/services/message.service";
import * as subscriptionService from "../../../../shared/services/subscription.service";
import {
  MessageTypesEnum,
  SubscriptionStatusEnum,
} from "../../../../shared/types/enums";
import { objectifyId } from "../../../../shared/utils/mongoose";
import { getPossibleSubscriptionsCountInPlan } from "./../../../../shared/libs/subscription/utils";
import { IUserWithSubscription } from "./../../../../shared/types/queueMessages";
const Logger = logger("subscription-expiration");

export const handleSubscriptionExpiration = async (userId: string) => {
  Logger("handleSubscriptionExpiration").info("");
  try {
    await updateUserSubscriptionAsExpired(userId);
  } catch (error) {
    Logger("handleSubscriptionExpiration").error(JSON.stringify(error));
    throw error;
  }
};

export const handleRecurringSubsExpiration = async (
  user: IUserWithSubscription,
  plan: IPlan
) => {
  Logger("handleRecurringSubsExpiration").info("");
  try {
    await updateUserSubscriptionAsExpired(user.id);

    const possibleSubscriptionsInPlan =
      getPossibleSubscriptionsCountInPlan(plan);

    const totalSubscriptionsBoughtInPlan = user.subscription.recurringGroup
      ? await subscriptionService.expiredSubscriptionsInGroup(
          user.subscription.recurringGroup
        )
      : 1;

    // TODO: create two WA templates, and use them
    // eslint-disable-next-line unicorn/prefer-ternary
    if (totalSubscriptionsBoughtInPlan >= possibleSubscriptionsInPlan) {
      await messageService.sendTextMessage({
        user: user.id,
        type: MessageTypesEnum.Text,
        payload: USER_MESSAGES.info.subscriptions.expired,
      });
    } else {
      await sendRenewSubscriptionMessage(user, plan);
    }
  } catch (error) {
    Logger("handleRecurringSubsExpiration").error(JSON.stringify(error));
    throw error;
  }
};

export const updateUserSubscriptionAsExpired = async (userId: string) => {
  Logger("updateUserSubscriptionAsExpired").info("");
  try {
    await subscriptionService.updateSubscription(
      {
        user: objectifyId(userId),
        status: SubscriptionStatusEnum.Active,
      },
      {
        status: SubscriptionStatusEnum.Expired,
      }
    );
  } catch (error) {
    Logger("updateUserSubscriptionAsExpired").error(JSON.stringify(error));
    await sendInternalAlert({
      message: `Failed to mark subscription as expired for user with id ${userId}`,
      severity: "major",
    });
    throw error;
  }
};

const sendRenewSubscriptionMessage = async (
  user: IUserWithSubscription,
  plan: IPlan
) => {
  Logger("sendRenewSubscriptionMessage").info("");
  try {
    const renewalLink = `${process.env.MEALPOINTS_BASE_URL}/renew?userId=${user.id}&planId=${plan.id}&recurringGroupId=${user.subscription.recurringGroup}`;
    const waMessage = `
      Hello, your subscription for the ${plan.name} plan is expired. 
      Please renew here: ${renewalLink}
    `;

    await messageService.sendTextMessage({
      user: user.id,
      type: MessageTypesEnum.Text,
      payload: waMessage,
    });
  } catch (error) {
    Logger("sendRenewSubscriptionMessage").error(JSON.stringify(error));
    throw error;
  }
};
