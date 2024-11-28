import { addMinutes, isWithinInterval, parse, subMinutes } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { isNaN } from "lodash";
import logger from "../../shared/config/logger";
import SettingsSingleton from "../../shared/config/settings";

const Logger = logger("user-engagement/utils");

export const shouldExecute = async (
  executionTime: string,
  timezone: string
): Promise<boolean> => {
  Logger("shouldExecute").info(`checking for ${executionTime} in ${timezone}`);

  const settings = await SettingsSingleton.getInstance();
  const windowInMinutes = settings.get(
    "user-engagement.flows.window-in-minutes"
  ) as number;

  // Validate and parse the execution time (HH:mm)
  const parsedTime = parse(executionTime, "HH:mm", new Date());
  if (isNaN(parsedTime.getTime())) {
    throw new TypeError('Invalid execution time format. Use "HH:mm".');
  }

  // Get the current time in the specified timezone
  const now = new Date();
  const currentZonedTime = toZonedTime(now, timezone);

  // Create the execution time adjusted to today's date in the target timezone
  const executionDateTime = new Date(
    currentZonedTime.getFullYear(),
    currentZonedTime.getMonth(),
    currentZonedTime.getDate(),
    parsedTime.getHours(),
    parsedTime.getMinutes()
  );

  // Define a ±x-minute interval around the execution time
  const startTime = subMinutes(executionDateTime, windowInMinutes / 2);
  const endTime = addMinutes(executionDateTime, windowInMinutes / 2);

  // Check if the current time falls within this interval
  const isInExecutionWindow = isWithinInterval(currentZonedTime, {
    start: startTime,
    end: endTime,
  });

  return isInExecutionWindow;
};
