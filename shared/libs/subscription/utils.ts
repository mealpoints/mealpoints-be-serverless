import { add } from "date-fns";
import { IOrder } from "../../models/order.model";
import { IPlan } from "../../models/plan.model";
import { PlanTypeEnum } from "../../types/enums";

export const getSubscriptionStartAndEndDates = (
  order: IOrder,
  plan: IPlan
): {
  startDate: Date;
  endDate: Date;
} => {
  const startDate = order.createdAt;
  const duration =
    plan.type === PlanTypeEnum.Recurring ? plan.billingCycle : plan.duration;

  if (!duration) {
    throw new Error("Duration information is required for the plan");
  }

  const endDate = add(startDate, {
    weeks: duration.unit === "weeks" ? duration.value : 0,
    months: duration.unit === "months" ? duration.value : 0,
  });

  return {
    startDate,
    endDate,
  };
};
