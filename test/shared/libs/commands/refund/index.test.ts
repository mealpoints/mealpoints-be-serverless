import { refundPayment } from "../../../../../shared/handlers/razorpay.handler";
import {
  refundConfirmed,
  refundRejectedByUser,
} from "../../../../../shared/libs/commands/refund";
import { DataService } from "../../../../test_utils/DataService";

jest.mock("../../../../../shared/handlers/razorpay.handler", () => ({
  refundPayment: jest.fn(),
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

    expect(await refundConfirmed(user)).not.toThrow();
  });

  it.only("refundRejected", async () => {
    const user = DataService.getInstance().getUser();

    expect(await refundRejectedByUser(user)).toBeUndefined();
  });
});
