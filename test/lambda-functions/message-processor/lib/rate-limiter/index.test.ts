import { isUserRateLimited } from "../../../../../lambda-functions/message-processor/lib/rate-limiter";
import * as config from "../../../../../shared/config/config";
import * as messageService from "../../../../../shared/services/message.service";
import { DataService } from "../../../../test_utils/DataService";

describe("isUserRateLimited", () => {
  it("should return false if the user is exempt from rate limiting", async () => {
    const userId = DataService.getInstance().getUser().id;
    const result = await isUserRateLimited(userId);
    expect(result).toBe(false);
  });

  it("should return true if the user has exceeded the message limit per day", async () => {
    const userId = "regularUser456";
    // Mock the messageCountByUserPerPeriod function to return a count greater than the limit
    jest
      .spyOn(messageService, "messageCountByUserPerPeriod")
      .mockResolvedValueOnce(config.RATE_LIMITER.message_limit_per_day + 1);

    const result = await isUserRateLimited(userId);
    expect(result).toBe(true);
  });

  it("should return false if the user has not exceeded the message limit per day", async () => {
    const userId = "regularUser789";
    // Mock the messageCountByUserPerPeriod function to return a count less than the limit
    jest
      .spyOn(messageService, "messageCountByUserPerPeriod")
      .mockResolvedValueOnce(config.RATE_LIMITER.message_limit_per_day - 1);

    const result = await isUserRateLimited(userId);
    expect(result).toBe(false);
  });
});
