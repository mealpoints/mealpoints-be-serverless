import { USER_MESSAGES } from "../../../../../shared/config/config";
import { isValidSubscription } from "../../../../../shared/libs/commands/refund/validSubscription";
import * as messageService from "../../../../../shared/services/message.service";
import {
  MessageTypesEnum,
  SubscriptionStatusEnum,
} from "../../../../../shared/types/enums";
import { DataService } from "../../../../test_utils/DataService";

jest.mock("../../../../../shared/services/message.service", () => ({
  sendTextMessage: jest.fn(),
}));

describe("isValidSubscription", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return true if subscription is valid", async () => {
    const { user, subscription } = DataService.getInstance();
    if (!subscription) {
      throw new Error("Subscription not found");
    }

    subscription.status = SubscriptionStatusEnum.Active;

    const result = await isValidSubscription(user, subscription);
    expect(result).toBe(true);
  });

  it("should return false if subscription is not valid", async () => {
    const dataService = DataService.getInstance();
    const { user, subscription } = dataService;
    if (!subscription) {
      throw new Error("Subscription not found");
    }

    subscription.status = SubscriptionStatusEnum.Cancelled;

    const result = await isValidSubscription(user, subscription);
    expect(messageService.sendTextMessage).toHaveBeenCalledWith({
      user: user.id,
      payload: USER_MESSAGES.errors.refund.subscription_already_cancelled,
      type: MessageTypesEnum.Text,
    });
    expect(result).toBe(false);
  });

  it("should return false if subscription is not valid", async () => {
    const dataService = DataService.getInstance();
    const { user, subscription } = dataService;
    if (!subscription) {
      throw new Error("Subscription not found");
    }

    subscription.status = SubscriptionStatusEnum.Expired;

    const result = await isValidSubscription(user, subscription);
    expect(messageService.sendTextMessage).toHaveBeenCalledWith({
      user: user.id,
      payload: USER_MESSAGES.errors.refund.subscription_expired,
      type: MessageTypesEnum.Text,
    });
    expect(result).toBe(false);
  });
});
