import logger from "../../../../shared/config/logger";
import SettingsSingleton from "../../../../shared/config/settings";
import * as messageService from "../../../../shared/services/message.service";
import {
  MessageTypesEnum,
  WhatsappTemplateNameEnum,
} from "../../../../shared/types/enums";
import { IUsersToSendReminders } from "../../../../shared/types/queueMessages";
import { createWhatsappTemplate } from "../../../../shared/utils/whatsappTemplateUtils";

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

  /**
   *  1. Extract the message body from the event
   *  2. OpenAI.ask to envoke model which generates reminder msg by giving the user.meals
   *  3. send the response to User via Meta service & store the response in userEngagementMessage schema
   *  4. return
   */

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

    await messageService.sendTemplateMessage({
      user: user.id,
      type: MessageTypesEnum.Template,
      template: createWhatsappTemplate(templateName, {}),
    });

    return;
  } catch (error) {
    Logger("processReminder").error(error);
    throw error;
  }
};
