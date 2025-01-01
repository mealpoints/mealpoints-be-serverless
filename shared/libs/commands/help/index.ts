import logger from "../../../config/logger";
import { IUser } from "../../../models/user.model";

const Logger = logger("shared/libs/commands/help");

export const helpRequested = async (user: IUser) => {
  Logger("helpRequested").info("");
  console.log(user);
};
