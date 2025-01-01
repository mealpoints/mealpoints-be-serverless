import logger from "../../config/logger";
import { IUser } from "../../models/user.model";
import { helpRequested } from "./help";
import { refundRequested } from "./refund";
import { containsCommand } from "./utils";

const Logger = logger("shared/libs/commands");
export const doesMessageContainCommand = async (
  message: string,
  user: IUser
) => {
  Logger("doesMessageContainCommand").info("");
  const isRefundRequested = containsCommand(message, "#refund");
  const isHelpRequested = containsCommand(message, "#help");

  try {
    if (isRefundRequested) {
      await refundRequested(user);
      return true;
    }
    if (isHelpRequested) {
      await helpRequested(user);
      return true;
    }
    return false;
  } catch (error) {
    Logger("doesMessageContainCommand").error(error);
    throw error;
  }
};
