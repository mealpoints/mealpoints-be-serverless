import {
  ComponentTypesEnum,
  LanguagesEnum,
  WhatsappTemplateNameEnum,
} from "../../types/enums";
import { MessageTemplateObject } from "../../types/message";

export interface IReminderToPostMealsOne {}
export interface IReminderToPostMealsTwo {}
export interface IReminderToPostMealsThree {}
export interface IRemindToLogMealViaText {}

export const createReminderToPostMealsOneTemplate =
  (): MessageTemplateObject<ComponentTypesEnum> => {
    return {
      name: WhatsappTemplateNameEnum.ReminderToPostMealsOne,
      language: {
        policy: "deterministic",
        code: LanguagesEnum.English,
      },
    };
  };

export const createReminderToPostMealsTwoTemplate =
  (): MessageTemplateObject<ComponentTypesEnum> => {
    return {
      name: WhatsappTemplateNameEnum.ReminderToPostMealsTwo,
      language: {
        policy: "deterministic",
        code: LanguagesEnum.English,
      },
    };
  };

export const createReminderToPostMealsThreeTemplate =
  (): MessageTemplateObject<ComponentTypesEnum> => {
    return {
      name: WhatsappTemplateNameEnum.ReminderToPostMealsThree,
      language: {
        policy: "deterministic",
        code: LanguagesEnum.English,
      },
    };
  };

export const createRemindToLogMealViaTextTemplate =
  (): MessageTemplateObject<ComponentTypesEnum> => {
    return {
      name: WhatsappTemplateNameEnum.RemindMealViaText,
      language: {
        policy: "deterministic",
        code: LanguagesEnum.English,
      },
    };
  };
