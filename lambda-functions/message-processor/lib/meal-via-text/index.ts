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

export const processRemindMealViaText = async (messageBody: IUser) => {
  Logger("processRemindMealViaText").info("Starting processRemindMealViaText");
  const user = messageBody;
  try {
    const templateName = WhatsappTemplateNameEnum.RemindMealViaText;
    const messageResponse = await messageService.sendTemplateMessage({
      user: user.id,
      type: MessageTypesEnum.Template,
      template: createWhatsappTemplate(templateName, {}),
    });

    if (messageResponse) {
      Logger("processRemindMealViaText").info(
        `Successfully sent reminder to user ${user.id}`
      );

      await userEngagementMessageService.createUserEngagementMessage({
        user: user.id,
        content: `Template: ${templateName}`,
        type: UserEngagementMessageTypesEnum.RemindMealViaText,
      });
    }
  } catch (error) {
    Logger("processRemindMealViaText").error("%o", error);
    throw error;
  }
};
