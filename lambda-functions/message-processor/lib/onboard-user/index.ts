import logger from "../../../../shared/config/logger";
import { sendInternalAlert } from "../../../../shared/libs/internal-alerts";
import { activateSubscription } from "../../../../shared/libs/subscription";
import { IOrder } from "../../../../shared/models/order.model";
import { IPlan } from "../../../../shared/models/plan.model";
import { IUser } from "../../../../shared/models/user.model";
import * as subscriptionService from "../../../../shared/services/subscription.service";
import { SubscriptionStatusEnum } from "../../../../shared/types/enums";

const Logger = logger("lib/onboard-user");

interface IProcessOnboardUser extends Omit<IOrder, "user" | "plan"> {
  user: IUser;
  plan: IPlan;
}

export const processOnboardUser = async (data: IProcessOnboardUser) => {
  Logger("processOnboardUser").info("%o", data);
  const { user, plan } = data;
  const order: IOrder = { ...data, user: user.id, plan: plan.id };

  try {
    // Make sure the user does not have an active subscription
    const lastSubscription = await subscriptionService.getSubscriptionByUserId(
      user.id
    );
    if (lastSubscription?.status === SubscriptionStatusEnum.Active) {
      Logger("processOnboardUser").info(
        "User already has an active subscription"
      );
      await sendInternalAlert({
        message: `User with id ${user.id} already has an active subscription and is trying to activate another one`,
        severity: "major",
      });

      return;
    }

    // Create Subscription
    await activateSubscription({
      user,
      plan,
      order,
      lastSubscription,
    });

    return;
  } catch {
    Logger("processOnboardUser").error(
      "Failed to process onboard user messages"
    );
    await sendInternalAlert({
      message: `Failed to onboard user with id: ${user.id} and contact: ${user.contact}`,
      severity: "critical",
    });

    throw new Error("Failed to process onboard user messages");
  }
};
