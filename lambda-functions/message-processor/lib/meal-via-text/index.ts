import logger from "../../../../shared/config/logger";
import { IUser } from "../../../../shared/models/user.model";
import * as messageService from "../../../../shared/services/message.service";
import * as userEngagementMessageService from "../../../../shared/services/userEngagement.service";
import {
  MessageTypesEnum,
  WhatsappTemplateNameEnum,
} from "../../../../shared/types/enums";
import { createWhatsappTemplate } from "../../../../shared/utils/whatsapp-templates";
import { UserEngagementMessageTypesEnum } from "./../../../../shared/types/enums";
const Logger = logger("message-processor/lib/remind-meal-via-text");

export const processFeatIntro_MealViaText = async (messageBody: IUser) => {
  Logger("processFeatIntro_MealViaText").info("");
  const user = messageBody;
  try {
    const templateName = WhatsappTemplateNameEnum.FeatIntro_MealViaText;
    const messageResponse = await messageService.sendTemplateMessage({
      user: user.id,
      type: MessageTypesEnum.Template,
      template: createWhatsappTemplate(templateName, {}),
    });

    if (messageResponse) {
      Logger("processFeatIntro_MealViaText").info(
        `Successfully sent Feature Intro to user ${user.id} with contact ${user.contact}`
      );

      await userEngagementMessageService.createUserEngagementMessage({
        user: user.id,
        content: `Template: ${templateName}`,
        type: UserEngagementMessageTypesEnum.FeatIntro_MealViaText,
      });
    }
  } catch (error) {
    Logger("processFeatIntro_MealViaText").error("%o", error);
    throw error;
  }
};
