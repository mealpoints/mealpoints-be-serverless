import logger from "../../../../shared/config/logger";
import SettingsSingleton from "../../../../shared/config/settings";
import * as messageService from "../../../../shared/services/message.service";
import * as userEngagementMessageService from "../../../../shared/services/userEngagement.service";
import {
  MessageTypesEnum,
  UserEngagementMessageTypesEnum,
  WhatsappTemplateNameEnum,
} from "../../../../shared/types/enums";
import { IUsersToSendReminders } from "../../../../shared/types/queueMessages";
import { createWhatsappTemplate } from "../../../../shared/utils/whatsapp-templates";

const Logger = logger("lib/reminder/logger");

const GET_REMINDER_MESSAGE_TEMPLATE_BASED_ON_REMINDER_COUNT: Record<
  number,
  WhatsappTemplateNameEnum
> = {
  0: WhatsappTemplateNameEnum.ReminderToPostMealsOne,
  1: WhatsappTemplateNameEnum.ReminderToPostMealsTwo,
  2: WhatsappTemplateNameEnum.ReminderToPostMealsThree,
};

export const processReminder = async (messageBody: IUsersToSendReminders) => {
  Logger("processReminder").info(`Starting processReminder`);

  const settings = await SettingsSingleton.getInstance();
  const maxReminders = settings.get("user-engangement.max-reminders") as number;
  const { user, remindersCount } = messageBody;

  try {
    if (remindersCount >= maxReminders) {
      Logger("processReminder").info(
        `User ${user.id} has reached the maximum number of reminders`
      );
      return;
    }
    const templateName =
      GET_REMINDER_MESSAGE_TEMPLATE_BASED_ON_REMINDER_COUNT[remindersCount] ||
      WhatsappTemplateNameEnum.ReminderToPostMealsOne;

    const messageResponse = await messageService.sendTemplateMessage({
      user: user.id,
      type: MessageTypesEnum.Template,
      template: createWhatsappTemplate(templateName, {}),
    });

    if (messageResponse) {
      Logger("processReminder").info(
        `Successfully sent reminder to user ${user.id}`
      );

      await userEngagementMessageService.createUserEngagementMessage({
        user: user.id,
        content: `Template: ${templateName}`,
        type: UserEngagementMessageTypesEnum.Reminder,
      });
    }

    return;
  } catch (error) {
    Logger("processReminder").error(error);
    throw error;
  }
};
