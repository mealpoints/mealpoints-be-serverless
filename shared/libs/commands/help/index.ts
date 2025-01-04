import { USER_MESSAGES } from "../../../config/config";
import logger from "../../../config/logger";
import { IUser } from "../../../models/user.model";
import * as messageService from "../../../services/message.service";
import { MessageTypesEnum } from "../../../types/enums";

const Logger = logger("shared/libs/commands/help");

export const helpRequested = async (user: IUser) => {
  Logger("helpRequested").info("");
  await messageService.sendTextMessage({
    user: user.id,
    payload: USER_MESSAGES.info.help,
    type: MessageTypesEnum.Text,
  });
};
