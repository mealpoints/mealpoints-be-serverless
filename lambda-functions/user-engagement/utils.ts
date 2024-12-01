import { addMinutes, isWithinInterval, parse, subMinutes } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { isNaN } from "lodash";
import logger from "../../shared/config/logger";

const Logger = logger("user-engagement/utils");

export const isLocalTimeInFlowWindow = (
  executionTime: string,
  timezone: string,
  windowInMinutes: number = 20
): boolean => {
  Logger("isLocalTimeInFlowWindow").info(
    `checking for ${executionTime} in ${timezone}`
  );

  // Validate and parse the execution time (HH:mm)
  const parsedTime = parse(executionTime, "HH:mm", new Date());
  if (isNaN(parsedTime.getTime())) {
    throw new TypeError('Invalid execution time format. Use "HH:mm".');
  }

  // Get the current time in the specified timezone
  const now = new Date();
  const currentZonedDateTime = toZonedTime(now, timezone);

  // Create the execution time adjusted to today's date in the target timezone
  const executionDateTime = new Date(
    currentZonedDateTime.getFullYear(),
    currentZonedDateTime.getMonth(),
    currentZonedDateTime.getDate(),
    parsedTime.getHours(),
    parsedTime.getMinutes()
  );

  // Define a ±x-minute interval around the execution time
  const startTime = subMinutes(executionDateTime, windowInMinutes / 2);
  const endTime = addMinutes(executionDateTime, windowInMinutes / 2);

  // Check if the current time falls within this interval
  const isInExecutionWindow = isWithinInterval(currentZonedDateTime, {
    start: startTime,
    end: endTime,
  });

  return isInExecutionWindow;
};
