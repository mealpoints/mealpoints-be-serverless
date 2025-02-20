import logger from "../../../../shared/config/logger";
import * as messageService from "../../../../shared/services/message.service";
import * as userEngagementMessageService from "../../../../shared/services/userEngagement.service";
import {
  MessageTypesEnum,
  UserEngagementMessageTypesEnum,
  WhatsappTemplateNameEnum,
} from "../../../../shared/types/enums";
import { IUserWithBLDReminderType } from "../../../../shared/types/queueMessages";
import { createWhatsappTemplate } from "../../../../shared/utils/whatsapp-templates";
const Logger = logger("message-processor/lib/bld-reminders/index");

const templateMapping: Partial<
  Record<UserEngagementMessageTypesEnum, WhatsappTemplateNameEnum>
> = {
  [UserEngagementMessageTypesEnum.BreakfastReminder]:
    WhatsappTemplateNameEnum.BreakfastReminderV1,
  [UserEngagementMessageTypesEnum.LunchReminder]:
    WhatsappTemplateNameEnum.LunchReminderV1,
  [UserEngagementMessageTypesEnum.DinnerReminder]:
    WhatsappTemplateNameEnum.DinnerReminderV1,
};

export const processBldReminders = async (
  messageBody: IUserWithBLDReminderType
) => {
  Logger("processBldReminders").info("");
  const { id: userId, bldReminderType } = messageBody;
  try {
    const templateName = templateMapping[bldReminderType];
    if (!templateName) {
      throw new Error("Invalid bldReminderType for WhatsApp template mapping");
    }

    const messageResponse = await messageService.sendTemplateMessage({
      user: userId,
      type: MessageTypesEnum.Template,
      template: createWhatsappTemplate(templateName, {}),
    });

    if (messageResponse) {
      Logger("processBldReminders").info(
        `Successfully sent BLD reminder to user ${userId}`
      );

      await userEngagementMessageService.createUserEngagementMessage({
        user: userId,
        content: `Template: ${templateName}`,
        type: bldReminderType,
      });
    }
  } catch (error) {
    Logger("processBldReminders").error(
      `${bldReminderType} Failed with 👉 ${JSON.stringify(error)}`
    );
    throw error;
  }
};
