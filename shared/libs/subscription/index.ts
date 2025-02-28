import logger from "../../config/logger";
import SettingsSingleton from "../../config/settings";
import { IOrder } from "../../models/order.model";
import { IPlan } from "../../models/plan.model";
import { ISubscription } from "../../models/subscription.model";
import { IUser } from "../../models/user.model";
import * as subscriptionService from "../../services/subscription.service";
import { SubscriptionStatusEnum } from "../../types/enums";
import { getSubscriptionStartAndEndDates } from "./utils";

const Logger = logger("lib/subscription");

interface IActivateSubscription {
  user: IUser;
  plan: IPlan;
  order: IOrder;
}

export const activateSubscription = async (data: IActivateSubscription) => {
  Logger("activateSubscription").info("");
  try {
    const { user, plan, order } = data;
    const { startDate, endDate } = getSubscriptionStartAndEndDates(order, plan);

    const subscription = await subscriptionService.createSubscription({
      user: user.id,
      plan: plan.id,
      status: SubscriptionStatusEnum.Active,
      billingCycleCount: 1,
      startedAt: startDate,
      expiresAt: endDate,
    });

    return subscription;
  } catch (error) {
    Logger("activateSubscription").error(error);
    throw error;
  }
};

interface IRenewSubscription {
  order: IOrder;
  plan: IPlan;
  subscription: ISubscription;
}

export const renewSubscription = async (data: IRenewSubscription) => {
  Logger("renewSubscription").info("");
  try {
    const { order, plan, subscription } = data;
    const { endDate } = getSubscriptionStartAndEndDates(order, plan);

    const renewedSubscription =
      await subscriptionService.updateSubscriptionById(subscription.id, {
        status: SubscriptionStatusEnum.Active,
        billingCycleCount: (subscription.billingCycleCount || 0) + 1,
        expiresAt: endDate,
      });

    return renewedSubscription;
  } catch (error) {
    Logger("renewSubscription").error(JSON.stringify(error));
    throw error;
  }
};

export const isUserSubscribed = async (user: IUser) => {
  Logger("isUserSubscribed").info("");
  try {
    // check if user is exempted from subscription
    const settings = await SettingsSingleton.getInstance();
    const exemptContacts = settings.get(
      "subscription.exempt-contacts"
    ) as string[];
    if (exemptContacts.includes(user.contact)) {
      return { isSubscribed: true, subscription: null };
    }

    const lastSubscription = await subscriptionService.getSubscriptionByUserId(
      user.id
    );

    if (!lastSubscription) {
      return { isSubscribed: false, subscription: null };
    }

    return lastSubscription.status === SubscriptionStatusEnum.Active
      ? { isSubscribed: true, subscription: lastSubscription }
      : { isSubscribed: false, subscription: lastSubscription };
  } catch (error) {
    Logger("isUserSubscribed").error(error);
    throw error;
  }
};
