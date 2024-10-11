import * as internalAlerts from "../../../../shared/libs/internal-alerts";

describe("InternalAlerts", () => {
  it("should send internal alert", () => {
    const message = "message";
    const severity = "info";
    internalAlerts.sendInternalAlert({ message, severity });
    setTimeout(() => {}, 2000);
  });
});
