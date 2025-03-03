import { getMaxPossibleBillingCycleCountInPlan } from "../../../../shared/libs/subscription/utils";
import { IPlan } from "../../../../shared/models/plan.model";
import {
  PlanDurationUnitEnum,
  PlanTypeEnum,
} from "../../../../shared/types/enums";

describe("getMaxPossibleBillingCycleCountInPlan", () => {
  describe("valid plans", () => {
    it("should return the correct number of cycles for a plan with weeks duration", () => {
      const plan: IPlan = {
        type: PlanTypeEnum.Recurring,
        duration: {
          unit: PlanDurationUnitEnum.Weeks,
          value: 10,
        },
        billingCycle: {
          unit: PlanDurationUnitEnum.Weeks,
          value: 2,
        },
      } as IPlan;

      const result = getMaxPossibleBillingCycleCountInPlan(plan);
      expect(result).toBe(5);
    });

    it("should return the correct number of cycles for a plan with months duration", () => {
      const plan: IPlan = {
        type: PlanTypeEnum.Recurring,
        duration: {
          unit: PlanDurationUnitEnum.Months,
          value: 6,
        },
        billingCycle: {
          unit: PlanDurationUnitEnum.Months,
          value: 2,
        },
      } as IPlan;
      const result = getMaxPossibleBillingCycleCountInPlan(plan);
      expect(result).toBe(3);
    });

    it("should handle cases where billing cycle duration is longer than the total duration", () => {
      const plan: IPlan = {
        type: PlanTypeEnum.Recurring,
        duration: {
          unit: PlanDurationUnitEnum.Weeks,
          value: 4,
        },
        billingCycle: {
          unit: PlanDurationUnitEnum.Weeks,
          value: 6,
        },
      } as IPlan;

      const result = getMaxPossibleBillingCycleCountInPlan(plan);
      expect(result).toBe(1); // At least one cycle exists even if duration < billingCycle
    });
  });

  describe("edge cases", () => {
    it("should return 1 if duration or billingCycle is missing", () => {
      const planWithNoDuration: IPlan = {
        type: PlanTypeEnum.Recurring,
        billingCycle: {
          unit: PlanDurationUnitEnum.Weeks,
          value: 4,
        },
      } as IPlan;

      const planWithNoBillingCycle: IPlan = {
        type: PlanTypeEnum.OneTime,
        duration: {
          unit: PlanDurationUnitEnum.Months,
          value: 6,
        },
      } as IPlan;

      expect(getMaxPossibleBillingCycleCountInPlan(planWithNoDuration)).toBe(1);
      expect(
        getMaxPossibleBillingCycleCountInPlan(planWithNoBillingCycle)
      ).toBe(1);
    });

    it("should handle zero-value durations gracefully", () => {
      const plan: IPlan = {
        type: PlanTypeEnum.OneTime,
        duration: {
          unit: PlanDurationUnitEnum.Months,
          value: 0,
        },
        billingCycle: {
          unit: PlanDurationUnitEnum.Months,
          value: 1,
        },
      } as IPlan;

      const result = getMaxPossibleBillingCycleCountInPlan(plan);
      expect(result).toBe(1); // Minimal possible number of cycles
    });

    it("should handle zero-value billing cycles gracefully", () => {
      const plan: IPlan = {
        type: PlanTypeEnum.Recurring,
        duration: {
          unit: PlanDurationUnitEnum.Months,
          value: 6,
        },
        billingCycle: {
          unit: PlanDurationUnitEnum.Months,
          value: 0,
        },
      } as IPlan;

      expect(getMaxPossibleBillingCycleCountInPlan(plan)).toBe(1);
    });
  });

  describe("invalid inputs", () => {
    it("should return 1 for completely empty plans", () => {
      const plan: IPlan = {} as IPlan;

      const result = getMaxPossibleBillingCycleCountInPlan(plan);
      expect(result).toBe(1);
    });
  });

  it("should correctly compute cycles for plan duration in months and billing cycle in days", () => {
    const plan: IPlan = {
      type: PlanTypeEnum.Recurring,
      duration: {
        unit: PlanDurationUnitEnum.Months,
        value: 3,
      },
      billingCycle: {
        unit: PlanDurationUnitEnum.Days,
        value: 15,
      },
    } as IPlan;
    const result = getMaxPossibleBillingCycleCountInPlan(plan);
    expect(result).toBe(6);
  });

  it("should correctly compute cycles for plan duration in days and billing cycle in months", () => {
    const plan: IPlan = {
      type: PlanTypeEnum.Recurring,
      duration: {
        unit: PlanDurationUnitEnum.Days,
        value: 60,
      },
      billingCycle: {
        unit: PlanDurationUnitEnum.Months,
        value: 1,
      },
    } as IPlan;
    const result = getMaxPossibleBillingCycleCountInPlan(plan);
    expect(result).toBe(2);
  });

  it("should correctly compute cycles for plan duration in weeks and billing cycle in days", () => {
    const plan: IPlan = {
      type: PlanTypeEnum.Recurring,
      duration: {
        unit: PlanDurationUnitEnum.Weeks,
        value: 3,
      },
      billingCycle: {
        unit: PlanDurationUnitEnum.Days,
        value: 5,
      },
    } as IPlan;
    const result = getMaxPossibleBillingCycleCountInPlan(plan);
    expect(result).toBe(4);
  });

  it("should correctly compute cycles for plan duration in days and billing cycle in weeks", () => {
    const plan: IPlan = {
      type: PlanTypeEnum.Recurring,
      duration: {
        unit: PlanDurationUnitEnum.Days,
        value: 20,
      },
      billingCycle: {
        unit: PlanDurationUnitEnum.Weeks,
        value: 1,
      },
    } as IPlan;
    const result = getMaxPossibleBillingCycleCountInPlan(plan);
    expect(result).toBe(2);
  });

  it("should correctly compute cycles for plan duration in days and billing cycle in days", () => {
    const plan: IPlan = {
      type: PlanTypeEnum.Recurring,
      duration: {
        unit: PlanDurationUnitEnum.Days,
        value: 45,
      },
      billingCycle: {
        unit: PlanDurationUnitEnum.Days,
        value: 15,
      },
    } as IPlan;
    const result = getMaxPossibleBillingCycleCountInPlan(plan);
    expect(result).toBe(3);
  });

  it("should correctly compute cycles for plan duration in weeks and billing cycle in months", () => {
    const plan: IPlan = {
      type: PlanTypeEnum.Recurring,
      duration: {
        unit: PlanDurationUnitEnum.Weeks,
        value: 8,
      },
      billingCycle: {
        unit: PlanDurationUnitEnum.Months,
        value: 1,
      },
    } as IPlan;
    const result = getMaxPossibleBillingCycleCountInPlan(plan);
    expect(result).toBe(1);
  });
});
