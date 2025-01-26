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

const convertToWeeks = (unit: PlanDurationUnitEnum, value: number): number => {
  switch (unit) {
    case PlanDurationUnitEnum.Months: {
      return value * 4;
    } // Approximation: 1 month ≈ 4 weeks
    case PlanDurationUnitEnum.Weeks: {
      return value;
    }
    default: {
      return 0;
    }
  }
};

export const getMaxPossibleBillingCycleCountInPlan = (plan: IPlan): number => {
  const { duration, billingCycle } = plan;

  if (!duration || !billingCycle || !duration.value || !billingCycle.value) {
    return 1;
  }

  const durationInWeeks = convertToWeeks(duration.unit, duration.value);
  const billingCycleInWeeks = convertToWeeks(
    billingCycle.unit,
    billingCycle.value
  );

  if (durationInWeeks === 0 || billingCycleInWeeks === 0) {
    return 1;
  }

  return Math.ceil(durationInWeeks / billingCycleInWeeks) || 1;
};
