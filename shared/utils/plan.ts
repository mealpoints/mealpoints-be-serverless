import { IPlan } from "../models/plan.model";
import { PlanDurationUnitEnum } from "../types/enums";

export const getHumanReadablePlanDuration = ({
  unit,
  value,
}: IPlan["duration"]) => {
  if (value === 1 && unit === PlanDurationUnitEnum.Weeks) {
    return "7-days";
  }
  return `${value}-${unit}`;
};
