import { getSubscriptionStartAndEndDates } from "../../../../shared/libs/subscription/utils";
import { IOrder } from "../../../../shared/models/order.model";
import { IPlan } from "../../../../shared/models/plan.model";

describe("getSubscriptionStartAndEndDates", () => {
  describe("recurring plans", () => {
    it("should return correct start and end dates for a recurring plan with weeks duration", () => {
      const order: IOrder = {
        createdAt: new Date("2023-01-01T00:00:00Z"),
      } as IOrder;

      const plan: IPlan = {
        type: "recurring",
        billingCycle: {
          unit: "weeks",
          value: 4,
        },
      } as IPlan;

      const result = getSubscriptionStartAndEndDates(order, plan);

      expect(result.startDate).toEqual(new Date("2023-01-01T00:00:00Z"));
      expect(result.endDate).toEqual(new Date("2023-01-29T00:00:00Z"));
    });

    it("should return correct start and end dates for a recurring plan with months duration", () => {
      const order: IOrder = {
        createdAt: new Date("2023-01-01T00:00:00Z"),
      } as IOrder;

      const plan: IPlan = {
        type: "recurring",
        billingCycle: {
          unit: "months",
          value: 2,
        },
      } as IPlan;

      const result = getSubscriptionStartAndEndDates(order, plan);

      expect(result.startDate).toEqual(new Date("2023-01-01T00:00:00Z"));
      expect(result.endDate).toEqual(new Date("2023-03-01T00:00:00Z"));
    });

    it("should throw an error if duration information is missing", () => {
      const order: IOrder = {
        createdAt: new Date("2023-01-01T00:00:00Z"),
      } as IOrder;

      const plan: IPlan = {
        type: "recurring",
      } as IPlan;

      expect(() => getSubscriptionStartAndEndDates(order, plan)).toThrow(
        "Duration information is required for the plan"
      );
    });
  });

  describe("one-time plans", () => {
    it("should return correct start and end dates for a one-time plan", () => {
      const order: IOrder = {
        createdAt: new Date("2023-01-01T00:00:00Z"),
      } as IOrder;

      const plan: IPlan = {
        type: "one-time",
        duration: {
          unit: "weeks",
          value: 6,
        },
      } as IPlan;

      const result = getSubscriptionStartAndEndDates(order, plan);

      expect(result.startDate).toEqual(new Date("2023-01-01T00:00:00Z"));
      expect(result.endDate).toEqual(new Date("2023-02-12T00:00:00Z"));
    });
  });
});
