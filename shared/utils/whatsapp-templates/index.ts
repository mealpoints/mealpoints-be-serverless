import logger from "../../config/logger";
import {
  ComponentTypesEnum,
  WhatsappTemplateNameEnum,
} from "../../types/enums";
import { MessageTemplateObject } from "../../types/message";
import {
  createBreakfastReminderV1Template,
  IBreakfastReminderV1,
} from "./bfReminderV1";
import {
  createDinnerReminderV1Template,
  IDinnerReminderV1,
} from "./dinnerReminderV1";
import {
  createFeatIntro_MealViaTextTemplate,
  IFeatIntro_MealViaText,
} from "./featIntro";
import {
  createLunchReminderV1Template,
  ILunchReminderV1,
} from "./lunchReminderV1";
import {
  createUserMealReportTemplate,
  IUserMealReportData,
} from "./mealReport";
import {
  createMissingNutritionBudgetTemplate,
  IMissingNutritionBudgetData,
} from "./missingNutritionBudget";
import { createOnboardingV1Template, IOnboardingV1Data } from "./onboardingV1";
import {
  createReminderToPostMealsOneTemplate,
  createReminderToPostMealsThreeTemplate,
  createReminderToPostMealsTwoTemplate,
  IReminderToPostMealsOne,
  IReminderToPostMealsThree,
  IReminderToPostMealsTwo,
} from "./reminder";
import {
  createSubscriptionRenewedV1Template,
  ISubscriptionRenewedV1Data,
} from "./subscriptionRenewedV1";
import {
  createWelcomeMessageTemplate,
  IWelcomeMessageData,
} from "./welcomeMessage";
const Logger = logger("shared/utils/whatsapp-templates");

// Mapping the enum values to their respective data types
type WhatsappTemplateDataMap = {
  [WhatsappTemplateNameEnum.ReminderToPostMealsOne]: IReminderToPostMealsOne;
  [WhatsappTemplateNameEnum.ReminderToPostMealsTwo]: IReminderToPostMealsTwo;
  [WhatsappTemplateNameEnum.ReminderToPostMealsThree]: IReminderToPostMealsThree;
  [WhatsappTemplateNameEnum.FeatIntro_MealViaText]: IFeatIntro_MealViaText;
  [WhatsappTemplateNameEnum.MealReport]: IUserMealReportData;
  [WhatsappTemplateNameEnum.WelcomeMessage]: IWelcomeMessageData;
  [WhatsappTemplateNameEnum.OnboardingV1]: IOnboardingV1Data;
  [WhatsappTemplateNameEnum.SubscriptionRenewedV1]: ISubscriptionRenewedV1Data;
  [WhatsappTemplateNameEnum.MissingNutritionBudget]: IMissingNutritionBudgetData;
  [WhatsappTemplateNameEnum.BreakfastReminderV1]: IBreakfastReminderV1;
  [WhatsappTemplateNameEnum.LunchReminderV1]: ILunchReminderV1;
  [WhatsappTemplateNameEnum.DinnerReminderV1]: IDinnerReminderV1;
};

export const createWhatsappTemplate = <T extends WhatsappTemplateNameEnum>(
  templateName: T,
  data: WhatsappTemplateDataMap[T]
): MessageTemplateObject<ComponentTypesEnum> => {
  Logger("createWhatsappTemplate").info(`Creating template: ${templateName}`);
  switch (templateName) {
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
    case WhatsappTemplateNameEnum.OnboardingV1: {
      return createOnboardingV1Template();
    }
    case WhatsappTemplateNameEnum.MissingNutritionBudget: {
      return createMissingNutritionBudgetTemplate();
    }
    case WhatsappTemplateNameEnum.SubscriptionRenewedV1: {
      return createSubscriptionRenewedV1Template();
    }
    case WhatsappTemplateNameEnum.BreakfastReminderV1: {
      return createBreakfastReminderV1Template();
    }
    case WhatsappTemplateNameEnum.LunchReminderV1: {
      return createLunchReminderV1Template();
    }
    case WhatsappTemplateNameEnum.DinnerReminderV1: {
      return createDinnerReminderV1Template();
    }
    default: {
      throw new Error("Template not found");
    }
  }
};
