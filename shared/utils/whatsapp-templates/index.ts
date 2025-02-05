import logger from "../../config/logger";
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
    default: {
      throw new Error("Template not found");
    }
  }
};
