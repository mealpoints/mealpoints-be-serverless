import { isUserRateLimited } from "../../../../../lambda-functions/message-processor/lib/rate-limiter";
import { DataService } from "../../../../test_utils/DataService";

describe("isUserRateLimited", () => {
  const user = DataService.getInstance().getUser();
  it("should return false if the user is exempt from rate limiting", async () => {
    const result = await isUserRateLimited(user);
    expect(result).toBe(false);
  });

  it("should return false if the user has not exceeded the message limit", async () => {
    const result = await isUserRateLimited(user);
    expect(result).toBe(false);
  });
});
