import logger from "../../../../shared/config/logger";

const Logger = logger("lib/reminder/meal-summary");

export const processMealSummary = async (messageBody: object) => {
  Logger("processMealSummary").info(``);

  /**
   *  1. Extract the message body from the event
   *  2. OpenAI.ask to envoke model which generates summary by giving the user.meals
   *  3. send the response to User via Meta service & store the response in userEngagementMessage schema
   *  4. return
   */

  console.log("Message :::",messageBody);

  // TODO: Remove this line after adding the logic
  // eslint-disable-next-line unicorn/no-useless-promise-resolve-reject
  return Promise.resolve();
};
