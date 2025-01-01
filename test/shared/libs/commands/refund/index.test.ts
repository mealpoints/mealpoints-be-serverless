import { refundPayment } from "../../../../../shared/handlers/razorpay.handler";
import {
  refundConfirmed,
  refundRejectedByUser,
  refundRequested,
} from "../../../../../shared/libs/commands/refund";
import { confirmRefund } from "../../../../../shared/libs/commands/refund/userMessages";
import { isValidSubscription } from "../../../../../shared/libs/commands/refund/validSubscription";
import { findOrder } from "../../../../../shared/services/order.service";
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

    expect(await refundConfirmed(user)).toBeUndefined();
  });

  it("refundRejected", async () => {
    const user = DataService.getInstance().getUser();

    expect(await refundRejectedByUser(user)).toBeUndefined();
  });
});

describe.only("refund requested flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should throw error if no order found", async () => {
    const { user } = DataService.getInstance();

    (isValidSubscription as jest.Mock).mockResolvedValue(true);

    (findOrder as jest.Mock).mockResolvedValue(null);

    await expect(refundRequested(user)).rejects.toThrow("No order found");
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
