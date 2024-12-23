import { FilterQuery, PopulateOptions } from "mongoose";
import logger from "../config/logger";
import Subscription, {
  ISubscription,
  ISubscriptionCreate,
} from "../models/subscription.model";
import { SubscriptionStatusEnum } from "../types/enums";

const Logger = logger("subscription.service");

export const createSubscription = async (data: ISubscriptionCreate) => {
  Logger("createSubscription").info("");
  try {
    const subscription = await Subscription.create(data);
    return subscription;
  } catch (error) {
    Logger("createSubscription").error(error);
    throw error;
  }
};

export const updateSubscriptionById = async (
  subscriptionId: string,
  data: Partial<ISubscription>
) => {
  Logger("updateSubscriptionById").info("%o", { subscriptionId, data });
  try {
    const subscription = await Subscription.findByIdAndUpdate(
      subscriptionId,
      data,
      {
        new: true,
      }
    );
    return subscription;
  } catch (error) {
    Logger("updateSubscriptionById").error(error);
    throw error;
  }
};

export const updateSubscription = async (
  filter: FilterQuery<ISubscription>,
  data: Partial<ISubscription>
) => {
  Logger("updateSubscription").info("%o", { filter, data });
  try {
    const subscription = await Subscription.findOneAndUpdate(filter, data, {
      new: true,
    });
    return subscription;
  } catch (error) {
    Logger("updateSubscription").error(error);
    throw error;
  }
};

export const getActiveSubscription = async (
  userId: string,
  populate?: PopulateOptions
) => {
  Logger("getActiveSubscription").info("");
  try {
    const subscription = await Subscription.findOne(
      {
        user: userId,
        status: SubscriptionStatusEnum.Active,
      },
      undefined,
      { populate }
    );

    return subscription;
  } catch (error) {
    Logger("getActiveSubscription").error(error);
    throw error;
  }
};

export const getSubscriptionById = async (
  subscriptionId: string,
  populate?: PopulateOptions
) => {
  Logger("getSubscriptionById").info("");
  try {
    const subscription = await Subscription.findById(subscriptionId).populate(
      populate?.path || ""
    );

    return subscription;
  } catch (error) {
    Logger("getSubscriptionById").error(error);
    throw error;
  }
};
