import { add } from "date-fns";
import logger from "../../config/logger";
import { IPlan } from "../../models/plan.model";
import { PlanDurationUnitEnum, PlanTypeEnum } from "../../types/enums";
const Logger = logger("lib/subscription");

export const getSubscriptionStartAndEndDates = (
  startDate: Date,
  plan: IPlan
): {
  startDate: Date;
  endDate: Date;
} => {
  const duration =
    plan.type === PlanTypeEnum.Recurring ? plan.billingCycle : plan.duration;

  if (!duration) {
    throw new Error("Duration information is required for the plan");
  }

  const endDate = add(startDate, {
    days: duration.unit === PlanDurationUnitEnum.Days ? duration.value : 0,
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
  Logger("getMaxPossibleBillingCycleCountInPlan").info(JSON.stringify(plan));
  const { duration, billingCycle } = plan;

  if (!duration || !billingCycle || !duration.value || !billingCycle.value) {
    Logger("getMaxPossibleBillingCycleCountInPlan").info(
      "Missing plan data returning 1"
    );
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
