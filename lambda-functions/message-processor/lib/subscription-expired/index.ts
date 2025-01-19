import logger from "../../../../shared/config/logger";
import { sendInternalAlert } from "../../../../shared/libs/internal-alerts";
import * as planService from "../../../../shared/services/plan.service";
import { PlanTypeEnum } from "../../../../shared/types/enums";
import { IUserWithSubscription } from "../../../../shared/types/queueMessages";
import {
  handleRecurringSubsExpiration,
  handleSubscriptionExpiration,
} from "./subscriptionExpiration";
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
      // QA: Do we even need this checks ?
      await sendInternalAlert({
        message: `Internal error: Plan Not Found. Resulting in Failed to mark subscription as expired for user with id ${user.id} and subscription with id ${user.subscription.id}`,
        severity: "major",
      });
      throw new Error(
        "Internal error: Plan Not Found. Failed to mark subscription as expired"
      );
    }

    await (usersCurrentPlan?.type == PlanTypeEnum.OneTime
      ? handleSubscriptionExpiration(user.id)
      : handleRecurringSubsExpiration(user, usersCurrentPlan));
  } catch (error) {
    Logger("processSubscriptionExpired").error(JSON.stringify(error));
    throw error;
  }
};
