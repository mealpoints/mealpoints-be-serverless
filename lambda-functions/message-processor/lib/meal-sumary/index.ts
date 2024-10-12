import logger from "../../../../shared/config/logger";

const Logger = logger("lib/reminder/meal-summary");

export const processMealSummary = async (messageBody: object) => {
  Logger("processMealSummary").info(``);

  console.log(messageBody);

  // TODO: Remove this line after adding the logic
  // eslint-disable-next-line unicorn/no-useless-promise-resolve-reject
  return Promise.resolve();
};
