import { USER_MESSAGES } from "../../../../shared/config/config";
import logger from "../../../../shared/config/logger";
import { IUser } from "../../../../shared/models/user.model";
import * as messageService from "../../../../shared/services/message.service";
import { MessageTypesEnum } from "../../../../shared/types/enums";

const Logger = logger("lib/whatsapp/processNonCustomer");

export const processNonCustomer = async (user: IUser) => {
  Logger("processNonCustomer").info("");

  await messageService.sendTextMessage({
    user: user.id,
    payload: USER_MESSAGES.info.user_not_subscribed,
    type: MessageTypesEnum.Text,
  });
};
