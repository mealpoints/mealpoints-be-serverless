import { add, differenceInDays } from "date-fns";
import logger from "../../config/logger";
import { IPlan } from "../../models/plan.model";
import { PlanDurationUnitEnum, PlanTypeEnum } from "../../types/enums";
const Logger = logger("lib/subscription");

const addDuration = (
  date: Date,
  duration: { value: number; unit: PlanDurationUnitEnum }
): Date => {
  return add(date, {
    days: duration.unit === PlanDurationUnitEnum.Days ? duration.value : 0,
    weeks: duration.unit === PlanDurationUnitEnum.Weeks ? duration.value : 0,
    months: duration.unit === PlanDurationUnitEnum.Months ? duration.value : 0,
  });
};

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

  const endDate = addDuration(startDate, duration);

  return {
    startDate,
    endDate,
  };
};

// NOTE: user is renewing the subs at this stage, hence we are to return 1 as max possible billing cycle in case of failures
export const getMaxPossibleBillingCycleCountInPlan = (
  plan: IPlan,
  planStartDate: Date
): number => {
  Logger("getMaxPossibleBillingCycleCountInPlan").info(JSON.stringify(plan));
  const { duration, billingCycle } = plan;

  if (!duration || !billingCycle || !duration.value || !billingCycle.value) {
    Logger("getMaxPossibleBillingCycleCountInPlan").info(
      "Missing plan data returning 1"
    );
    return 1;
  }

  // for matching units return cycles directly
  if (duration.unit === billingCycle.unit) {
    const cycles = Math.floor(duration.value / billingCycle.value);
    return cycles > 0 ? cycles : 1;
  }

  // converting duration and billing cycle into days for easy comparison
  const planEndDate = addDuration(planStartDate, duration);
  const billingCycleEndDate = addDuration(planStartDate, billingCycle);

  const planDurationDays = differenceInDays(planEndDate, planStartDate);
  const billingCycleDays = differenceInDays(billingCycleEndDate, planStartDate);

  if (billingCycleDays <= 0) {
    Logger("getMaxPossibleBillingCycleCountInPlan").info(
      "Billing cycle duration in days is invalid, returning 1"
    );
    return 1;
  }

  const cycles = Math.floor(planDurationDays / billingCycleDays);
  return cycles > 0 ? cycles : 1;
};
