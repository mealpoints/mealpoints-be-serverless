import {
  ComponentTypesEnum,
  WhatsappTemplateNameEnum,
} from "../../types/enums";
import { MessageTemplateObject } from "../../types/message";
import {
  createFeatIntro_MealViaTextTemplate,
  IFeatIntro_MealViaText,
} from "./featIntro";
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
import {
  createUserPreferencesV1Template,
  IUserPreferencesV1Data,
} from "./userPreferences";
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
  [WhatsappTemplateNameEnum.FeatIntro_MealViaText]: IFeatIntro_MealViaText;
  [WhatsappTemplateNameEnum.MealReport]: IUserMealReportData;
  [WhatsappTemplateNameEnum.WelcomeMessage]: IWelcomeMessageData;
  [WhatsappTemplateNameEnum.UserPreferencesV1]: IUserPreferencesV1Data;
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
    case WhatsappTemplateNameEnum.FeatIntro_MealViaText: {
      return createFeatIntro_MealViaTextTemplate();
    }
    case WhatsappTemplateNameEnum.MealReport: {
      return createUserMealReportTemplate(data as IUserMealReportData);
    }
    case WhatsappTemplateNameEnum.WelcomeMessage: {
      return createWelcomeMessageTemplate();
    }
    case WhatsappTemplateNameEnum.UserPreferencesV1: {
      return createUserPreferencesV1Template();
    }
    default: {
      throw new Error("Template not found");
    }
  }
};
