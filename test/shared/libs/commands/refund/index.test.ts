import { USER_MESSAGES } from "../../../../../shared/config/config";
import {
  refundConfirmed,
  refundRejectedByUser,
  refundRequested,
} from "../../../../../shared/libs/commands/refund";
import {
  confirmRefund,
  refundProcessed,
} from "../../../../../shared/libs/commands/refund/userMessages";
import { isValidSubscription } from "../../../../../shared/libs/commands/refund/validSubscription";
import { sendInternalAlert } from "../../../../../shared/libs/internal-alerts";
import * as messageService from "../../../../../shared/services/message.service";
import {
  findOrder,
  issueRefund,
} from "../../../../../shared/services/order.service";
import {
  getSubscriptionByUserId,
  updateSubscriptionById,
} from "../../../../../shared/services/subscription.service";
import { MessageTypesEnum } from "../../../../../shared/types/enums";
import { DataService } from "../../../../test_utils/DataService";

jest.mock("../../../../../shared/libs/internal-alerts", () => ({
  sndInternalAlert: jest.fn(),
}));

jest.mock("../../../../../shared/handlers/razorpay.handler", () => ({
  refundPayment: jest.fn(),
}));

jest.mock("../../../../../shared/services/order.service", () => ({
  findOrder: jest.fn(),
  issueRefund: jest.fn(),
}));

jest.mock(
  "../../../../../shared/libs/commands/refund/validSubscription",
  () => ({
    isValidSubscription: jest.fn(),
  })
);

jest.mock("../../../../../shared/libs/commands/refund/userMessages", () => ({
  confirmRefund: jest.fn(),
  refundProcessed: jest.fn(),
}));

jest.mock("../../../../../shared/services/message.service", () => ({
  sendTextMessage: jest.fn(),
}));

jest.mock("../../../../../shared/services/subscription.service", () => ({
  getSubscriptionByUserId: jest.fn(),
  updateSubscriptionById: jest.fn(),
}));

describe("refund flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("refundConfirmed -  happy path", async () => {
    const user = DataService.getInstance().getUser();

    (getSubscriptionByUserId as jest.Mock).mockResolvedValue({
      planId: "plan-id",
    });

    (findOrder as jest.Mock).mockResolvedValue({
      paymentId: "payment-id",
    });

    (issueRefund as jest.Mock).mockResolvedValue({
      id: "refund-id",
    });

    (updateSubscriptionById as jest.Mock).mockResolvedValue({
      status: "cancelled",
    });

    (refundProcessed as jest.Mock).mockResolvedValue({});

    expect(await refundConfirmed(user)).toBeUndefined();
  });

  it("refundConfirmed -  failed requests", async () => {
    const user = DataService.getInstance().getUser();

    (getSubscriptionByUserId as jest.Mock).mockRejectedValue(
      new Error("error")
    );

    (findOrder as jest.Mock).mockResolvedValue({
      paymentId: "payment-id",
    });

    (issueRefund as jest.Mock).mockResolvedValue({
      id: "refund-id",
    });

    (updateSubscriptionById as jest.Mock).mockResolvedValue({
      status: "cancelled",
    });

    (refundProcessed as jest.Mock).mockResolvedValue({});

    await expect(refundConfirmed(user)).rejects.toThrow("error");

    expect(sendInternalAlert).toHaveBeenCalledWith({
      message: `Refund failed for user ${user.id}`,
      severity: "major",
    });
  });

  it("refundRejected", async () => {
    const user = DataService.getInstance().getUser();
    expect(await refundRejectedByUser(user)).toBeUndefined();
  });
});

describe("refund requested flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should throw error if no order found", async () => {
    const { user } = DataService.getInstance();

    (isValidSubscription as jest.Mock).mockResolvedValue(true);

    (findOrder as jest.Mock).mockResolvedValue(null);

    await expect(refundRequested(user)).rejects.toThrow("No order found");
    expect(messageService.sendTextMessage).toHaveBeenCalledWith({
      user: user.id,
      payload: USER_MESSAGES.errors.text_not_processed,
      type: MessageTypesEnum.Text,
    });
  });

  it("should throw error if no subscription found", async () => {
    const { user } = DataService.getInstance();

    (isValidSubscription as jest.Mock).mockResolvedValue(false);

    await expect(refundRequested(user)).rejects.toThrow(
      "No subscription found"
    );
  });

  it("should confirm refund", async () => {
    const { user } = DataService.getInstance();

    (isValidSubscription as jest.Mock).mockResolvedValue(true);
    (findOrder as jest.Mock).mockResolvedValue({});

    expect(await refundRequested(user)).toBeUndefined();
    expect(confirmRefund).toHaveBeenCalledWith(user);
  });
});
