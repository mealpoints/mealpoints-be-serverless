import { addMinutes, isWithinInterval, parse, subMinutes } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { isLocalTimeInFlowWindow } from "../../../lambda-functions/user-engagement/utils";
import SettingsSingleton from "../../../shared/config/settings";

// Mock the dependencies
jest.mock("date-fns-tz");
jest.mock("date-fns", () => ({
  ...jest.requireActual("date-fns"),
  parse: jest.fn(),
  addMinutes: jest.fn(),
  subMinutes: jest.fn(),
  isWithinInterval: jest.fn(),
}));
jest.mock("../../../shared/config/settings");

describe("isLocalTimeInFlowWindow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return true if the current time is within the execution window", () => {
    const executionTime = "12:00";
    const timezone = "UTC";
    const windowInMinutes = 10;

    const currentZonedTime = new Date("2023-06-15T12:00:00Z");
    const parsedTime = new Date("2023-06-15T12:00:00Z");
    const startTime = new Date("2023-06-15T11:55:00Z");
    const endTime = new Date("2023-06-15T12:05:00Z");

    (toZonedTime as jest.Mock).mockReturnValue(currentZonedTime);
    (parse as jest.Mock).mockReturnValue(parsedTime);
    (subMinutes as jest.Mock).mockReturnValue(startTime);
    (addMinutes as jest.Mock).mockReturnValue(endTime);
    (isWithinInterval as jest.Mock).mockReturnValue(true);

    const result = isLocalTimeInFlowWindow(
      executionTime,
      timezone,
      windowInMinutes
    );
    expect(result).toBe(true);
  });

  it("should return false if the current time is outside the execution window", () => {
    const executionTime = "12:00";
    const timezone = "UTC";
    const windowInMinutes = 10;

    const currentZonedTime = new Date("2023-06-15T12:00:00Z");
    const parsedTime = new Date("2023-06-15T12:00:00Z");
    const startTime = new Date("2023-06-15T11:55:00Z");
    const endTime = new Date("2023-06-15T12:05:00Z");

    (toZonedTime as jest.Mock).mockReturnValue(currentZonedTime);
    (parse as jest.Mock).mockReturnValue(parsedTime);
    (subMinutes as jest.Mock).mockReturnValue(startTime);
    (addMinutes as jest.Mock).mockReturnValue(endTime);
    (isWithinInterval as jest.Mock).mockReturnValue(false);

    const result = isLocalTimeInFlowWindow(
      executionTime,
      timezone,
      windowInMinutes
    );
    expect(result).toBe(false);
  });

  it("should throw an error if the execution time format is invalid", async () => {
    const executionTime = "invalid-time";
    const timezone = "UTC";
    const windowInMinutes = 10;

    (SettingsSingleton.getInstance as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue(windowInMinutes),
    });
    (parse as jest.Mock).mockReturnValue(new Date("Invalid Date"));

    await expect(
      isLocalTimeInFlowWindow(executionTime, timezone)
    ).rejects.toThrow('Invalid execution time format. Use "HH:mm".');
  });

  it("should handle different timezones correctly", () => {
    const executionTime = "12:00";
    const timezone = "Asia/Kolkata";
    const windowInMinutes = 10;

    const currentZonedTime = new Date("2023-06-15T12:00:00+05:30"); // Asia/Kolkata time
    const parsedTime = new Date("2023-06-15T12:00:00+05:30");
    const startTime = new Date("2023-06-15T11:55:00+05:30");
    const endTime = new Date("2023-06-15T12:05:00+05:30");

    (toZonedTime as jest.Mock).mockReturnValue(currentZonedTime);
    (parse as jest.Mock).mockReturnValue(parsedTime);
    (subMinutes as jest.Mock).mockReturnValue(startTime);
    (addMinutes as jest.Mock).mockReturnValue(endTime);
    (isWithinInterval as jest.Mock).mockReturnValue(true);

    const result = isLocalTimeInFlowWindow(
      executionTime,
      timezone,
      windowInMinutes
    );
    expect(result).toBe(true);
  });
});
