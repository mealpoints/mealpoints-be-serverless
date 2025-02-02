import logger from "../../../../shared/config/logger";
import { sendInternalAlert } from "../../../../shared/libs/internal-alerts";
import { getMaxPossibleBillingCycleCountInPlan } from "../../../../shared/libs/subscription/utils";
import * as planService from "../../../../shared/services/plan.service";
import * as subscriptionService from "../../../../shared/services/subscription.service";
import {
  PlanTypeEnum,
  SubscriptionStatusEnum,
} from "../../../../shared/types/enums";
import { IUserWithSubscription } from "../../../../shared/types/queueMessages";
const Logger = logger("user-engagement/subscription-check");

export const processSubscriptionExpired = async (
  messageBody: IUserWithSubscription
) => {
  Logger("processSubscriptionExpired").info("");
  const user = messageBody;
  try {
    const usersCurrentPlan = await planService.getPlanById(
      user.subscription.plan
    );

    if (!usersCurrentPlan) {
      throw new Error(
        `Plan Not Found for ${user.id}. Failed to mark subscription as expired`
      );
    }

    let subscriptionStatusToBeMarked = SubscriptionStatusEnum.Expired;

    if (usersCurrentPlan.type == PlanTypeEnum.Recurring) {
      if (!user.subscription?.billingCycleCount) {
        throw new Error(
          `Billing cycle count is missing for a recurring plan for user ID ${user.id} and subscription ID ${user.subscription.id}`
        );
      }

      // TODO: endDate of last billing cycle must not exceed the plan's end date (this may arise due to delayed renewals from user end.) 
      const maxCycles = getMaxPossibleBillingCycleCountInPlan(usersCurrentPlan);
      if (user.subscription?.billingCycleCount < maxCycles) {
        subscriptionStatusToBeMarked = SubscriptionStatusEnum.Paused;
      }
    }

    await subscriptionService.updateSubscriptionById(user.subscription.id, {
      status: subscriptionStatusToBeMarked,
    });
  } catch (error) {
    Logger("processSubscriptionExpired").error(JSON.stringify(error));
    await sendInternalAlert({
      message: `Failed to mark subscription as expired for user with id ${user.id} and subscription id ${user.subscription.id}`,
      severity: "major",
    });
    throw error;
  }
};
