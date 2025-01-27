import logger from "../../../../shared/config/logger";
import { IUser } from "../../../../shared/models/user.model";
import * as messageService from "../../../../shared/services/message.service";
import {
  MessageTypesEnum,
  WhatsappTemplateNameEnum,
} from "../../../../shared/types/enums";
import { createWhatsappTemplate } from "../../../../shared/utils/whatsapp-templates";

const Logger = logger("lib/whatsapp/requestNutritionBudget");

export const requestNutritionBudget = async (user: IUser) => {
  Logger("requestNutritionBudget").info("");

  await messageService.sendTemplateMessage({
    user: user.id,
    type: MessageTypesEnum.Template,
    template: createWhatsappTemplate(
      WhatsappTemplateNameEnum.MissingNutritionBudget,
      {}
    ),
  });
};
