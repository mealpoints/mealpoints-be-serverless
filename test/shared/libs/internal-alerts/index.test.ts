import * as internalAlerts from "../../../../shared/libs/internal-alerts";

describe("InternalAlerts", () => {
  it("should send internal alert", async () => {
    const message = "message";
    const severity = "minor";
    await internalAlerts.sendInternalAlert({ message, severity });
    setTimeout(() => {}, 2000);
  });
});
