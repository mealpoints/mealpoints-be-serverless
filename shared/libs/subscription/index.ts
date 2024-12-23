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
      order: [order.id],
      status: SubscriptionStatusEnum.Active,
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

// TODO: This function is not tested even once!
export const renewSubscription = async (data: IRenewSubscription) => {
  Logger("renewSubscription").info("%o", data);

  const { order, plan, subscription } = data;
  try {
    const { endDate } = getSubscriptionStartAndEndDates(order, plan);

    const renewedSubscription =
      await subscriptionService.updateSubscriptionById(subscription.id, {
        status: SubscriptionStatusEnum.Active,
        expiresAt: endDate,
      });

    return renewedSubscription;
  } catch (error) {
    Logger("renewSubscription").error(error);
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
      return true;
    }

    const activeSubscription = await subscriptionService.getActiveSubscription(
      user.id
    );
    return !!activeSubscription;
  } catch (error) {
    Logger("isUserSubscribed").error(error);
    throw error;
  }
};
