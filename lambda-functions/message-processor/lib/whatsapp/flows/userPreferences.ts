import logger from "../../../../../shared/config/logger";
import { IUser } from "../../../../../shared/models/user.model";
import * as messageService from "../../../../../shared/services/message.service";
import { MessageTypesEnum } from "../../../../../shared/types/enums";

const Logger = logger("lib/whatsapp/interactiveMessage/flowReply");

export const userPreferences = async (data: unknown, user: IUser) => {
  Logger("userPreferences").info("");
  console.log(data);

  await messageService.sendTextMessage({
    user: user.id,
    payload: JSON.stringify(data as string),
    type: MessageTypesEnum.Text,
  });
};
