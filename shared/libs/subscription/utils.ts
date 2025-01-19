import { add } from "date-fns";
import { IOrder } from "../../models/order.model";
import { IPlan } from "../../models/plan.model";
import { PlanDurationUnitEnum, PlanTypeEnum } from "../../types/enums";

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
    weeks: duration.unit === PlanDurationUnitEnum.Weeks ? duration.value : 0,
    months: duration.unit === PlanDurationUnitEnum.Months ? duration.value : 0,
  });

  return {
    startDate,
    endDate,
  };
};

export const getPossibleSubscriptionsCountInPlan = (plan: IPlan): number => {
  const { duration, billingCycle } = plan;

  if (!duration || !billingCycle) {
    return 1;
  }

  const durationInWeeks =
    duration.unit === PlanDurationUnitEnum.Months
      ? duration.value * 4
      : duration.value;
  const billingCycleInWeeks = PlanDurationUnitEnum.Months
    ? billingCycle.value * 4
    : billingCycle.value;

  return Math.ceil(durationInWeeks / billingCycleInWeeks) || 1;
};
