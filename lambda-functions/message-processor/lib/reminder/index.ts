import logger from "../../../../shared/config/logger";

const Logger = logger("lib/reminder/logger");

export const processReminder = async (messageBody: object) => {
  Logger("processReminder").info(``);

  console.log(messageBody);

  // TODO: Remove this line after adding the logic
  // eslint-disable-next-line unicorn/no-useless-promise-resolve-reject
  return Promise.resolve();
};
