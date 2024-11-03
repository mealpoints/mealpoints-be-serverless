import logger from "../../../../shared/config/logger";
import { IUsersToSendSummaries } from "../../../../shared/types/queueMessages";

const Logger = logger("lib/reminder/meal-summary");

export const processMealSummary = async (
  messageBody: IUsersToSendSummaries
) => {
  Logger("processMealSummary").info(``);
  return;
};
