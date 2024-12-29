import {
  ComponentTypesEnum,
  WhatsappTemplateNameEnum,
} from "../../types/enums";
import { MessageTemplateObject } from "../../types/message";
import {
  createUserMealReportTemplate,
  IUserMealReportData,
} from "./mealReport";
import {
  createReminderToPostMealsOneTemplate,
  createReminderToPostMealsThreeTemplate,
  createReminderToPostMealsTwoTemplate,
  createRemindToLogMealViaTextTemplate,
  IReminderToPostMealsOne,
  IReminderToPostMealsThree,
  IReminderToPostMealsTwo,
  IRemindToLogMealViaText,
} from "./reminder";
import {
  createUserMealSummaryTemplate,
  IUserMealSummaryData,
} from "./userMealSummary";
import {
  createWelcomeMessageTemplate,
  IWelcomeMessageData,
} from "./welcomeMessage";

// Mapping the enum values to their respective data types
type WhatsappTemplateDataMap = {
  [WhatsappTemplateNameEnum.UserMealSummary]: IUserMealSummaryData;
  [WhatsappTemplateNameEnum.ReminderToPostMealsOne]: IReminderToPostMealsOne;
  [WhatsappTemplateNameEnum.ReminderToPostMealsTwo]: IReminderToPostMealsTwo;
  [WhatsappTemplateNameEnum.ReminderToPostMealsThree]: IReminderToPostMealsThree;
  [WhatsappTemplateNameEnum.RemindMealViaText]: IRemindToLogMealViaText;
  [WhatsappTemplateNameEnum.MealReport]: IUserMealReportData;
  [WhatsappTemplateNameEnum.WelcomeMessage]: IWelcomeMessageData;
};

export const createWhatsappTemplate = <T extends WhatsappTemplateNameEnum>(
  templateName: T,
  data: WhatsappTemplateDataMap[T]
): MessageTemplateObject<ComponentTypesEnum> => {
  switch (templateName) {
    case WhatsappTemplateNameEnum.UserMealSummary: {
      return createUserMealSummaryTemplate(data as IUserMealSummaryData);
    }
    case WhatsappTemplateNameEnum.ReminderToPostMealsOne: {
      return createReminderToPostMealsOneTemplate();
    }
    case WhatsappTemplateNameEnum.ReminderToPostMealsTwo: {
      return createReminderToPostMealsTwoTemplate();
    }
    case WhatsappTemplateNameEnum.ReminderToPostMealsThree: {
      return createReminderToPostMealsThreeTemplate();
    }
    case WhatsappTemplateNameEnum.RemindMealViaText: {
      return createRemindToLogMealViaTextTemplate();
    }
    case WhatsappTemplateNameEnum.MealReport: {
      return createUserMealReportTemplate(data as IUserMealReportData);
    }
    case WhatsappTemplateNameEnum.WelcomeMessage: {
      return createWelcomeMessageTemplate();
    }
    default: {
      throw new Error("Template not found");
    }
  }
};
