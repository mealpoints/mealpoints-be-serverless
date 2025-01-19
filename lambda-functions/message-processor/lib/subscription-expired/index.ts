import logger from "../../../../shared/config/logger";
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
      throw new Error(
        `Plan Not Found for ${user.id}. Failed to mark subscription as expired`
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
