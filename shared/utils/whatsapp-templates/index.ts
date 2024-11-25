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
  IReminderToPostMealsOne,
  IReminderToPostMealsThree,
  IReminderToPostMealsTwo,
} from "./reminder";
import {
  createUserMealSummaryTemplate,
  IUserMealSummaryData,
} from "./userMealSummary";

// Mapping the enum values to their respective data types
type WhatsappTemplateDataMap = {
  [WhatsappTemplateNameEnum.UserMealSummary]: IUserMealSummaryData;
  [WhatsappTemplateNameEnum.ReminderToPostMealsOne]: IReminderToPostMealsOne;
  [WhatsappTemplateNameEnum.ReminderToPostMealsTwo]: IReminderToPostMealsTwo;
  [WhatsappTemplateNameEnum.ReminderToPostMealsThree]: IReminderToPostMealsThree;
  [WhatsappTemplateNameEnum.UserMealReport]: IUserMealReportData;
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
    case WhatsappTemplateNameEnum.UserMealReport: {
      return createUserMealReportTemplate(data as IUserMealReportData);
    }
    default: {
      throw new Error("Template not found");
    }
  }
};
