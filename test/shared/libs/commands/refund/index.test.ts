import { USER_MESSAGES } from "../../../../../shared/config/config";
import { refundPayment } from "../../../../../shared/handlers/razorpay.handler";
import {
  refundConfirmed,
  refundRejectedByUser,
  refundRequested,
} from "../../../../../shared/libs/commands/refund";
import { confirmRefund } from "../../../../../shared/libs/commands/refund/userMessages";
import { isValidSubscription } from "../../../../../shared/libs/commands/refund/validSubscription";
import * as messageService from "../../../../../shared/services/message.service";
import { findOrder } from "../../../../../shared/services/order.service";
import { MessageTypesEnum } from "../../../../../shared/types/enums";
import { DataService } from "../../../../test_utils/DataService";

jest.mock("../../../../../shared/handlers/razorpay.handler", () => ({
  refundPayment: jest.fn(),
}));

jest.mock("../../../../../shared/services/order.service", () => ({
  findOrder: jest.fn(),
}));

jest.mock(
  "../../../../../shared/libs/commands/refund/validSubscription",
  () => ({
    isValidSubscription: jest.fn(),
  })
);

jest.mock("../../../../../shared/libs/commands/refund/userMessages", () => ({
  confirmRefund: jest.fn(),
}));

jest.mock("../../../../../shared/services/message.service", () => ({
  sendTextMessage: jest.fn(),
}));

describe("refund flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("refundConfirmed", async () => {
    const user = DataService.getInstance().getUser();

    // Mock successfull refund
    (refundPayment as jest.Mock).mockResolvedValue({
      id: "refund-id",
      entity: "refund",
    });

    (findOrder as jest.Mock).mockResolvedValue({
      paymentId: "payment-id",
    });

    expect(await refundConfirmed(user)).toBeUndefined();
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
