import {
  ComponentTypesEnum,
  LanguagesEnum,
  ParametersTypesEnum,
  WhatsappTemplateNameEnum,
} from "../types/enums";
import { MessageTemplateObject } from "../types/message";

interface IUserMealSummaryData {
  duration: string;
  averageMealScore: string;
  totalCalories: string;
  topMealName: string;
  topMealScore: string;
  topMealCalories: string;
  topMealProtein: string;
  topMealFat: string;
  topMealCarbs: string;
  topMealFiber: string;
  topMealSugars: string;
  analysisOne: string;
  analysisTwo: string;
  analysisThree: string;
  motivation: string;
}

interface IReminderToPostMealsOne {}
interface IReminderToPostMealsTwo {}
interface IReminderToPostMealsThree {}

const createUserMealSummaryTemplate = (
  data: IUserMealSummaryData
): MessageTemplateObject<ComponentTypesEnum> => {
  return {
    name: WhatsappTemplateNameEnum.UserMealSummary,
    language: {
      policy: "deterministic",
      code: LanguagesEnum.English,
    },
    components: [
      {
        type: ComponentTypesEnum.Body,
        parameters: [
          {
            type: ParametersTypesEnum.Text,
            text: data.duration,
          },
          {
            type: ParametersTypesEnum.Text,
            text: data.averageMealScore,
          },
          {
            type: ParametersTypesEnum.Text,
            text: data.totalCalories,
          },
          {
            type: ParametersTypesEnum.Text,
            text: data.topMealName,
          },
          {
            type: ParametersTypesEnum.Text,
            text: data.topMealScore,
          },
          {
            type: ParametersTypesEnum.Text,
            text: data.topMealCalories,
          },
          {
            type: ParametersTypesEnum.Text,
            text: data.topMealProtein,
          },
          {
            type: ParametersTypesEnum.Text,
            text: data.topMealFat,
          },
          {
            type: ParametersTypesEnum.Text,
            text: data.topMealCarbs,
          },
          {
            type: ParametersTypesEnum.Text,
            text: data.topMealFiber,
          },
          {
            type: ParametersTypesEnum.Text,
            text: data.topMealSugars,
          },
          {
            type: ParametersTypesEnum.Text,
            text: data.analysisOne,
          },
          {
            type: ParametersTypesEnum.Text,
            text: data.analysisTwo,
          },
          {
            type: ParametersTypesEnum.Text,
            text: data.analysisThree,
          },
          {
            type: ParametersTypesEnum.Text,
            text: data.motivation,
          },
        ],
      },
    ],
  };
};

const createReminderToPostMealsOneTemplate =
  (): MessageTemplateObject<ComponentTypesEnum> => {
    return {
      name: WhatsappTemplateNameEnum.ReminderToPostMealsOne,
      language: {
        policy: "deterministic",
        code: LanguagesEnum.English,
      },
    };
  };

const createReminderToPostMealsTwoTemplate =
  (): MessageTemplateObject<ComponentTypesEnum> => {
    return {
      name: WhatsappTemplateNameEnum.ReminderToPostMealsTwo,
      language: {
        policy: "deterministic",
        code: LanguagesEnum.English,
      },
    };
  };

const createReminderToPostMealsThreeTemplate =
  (): MessageTemplateObject<ComponentTypesEnum> => {
    return {
      name: WhatsappTemplateNameEnum.ReminderToPostMealsThree,
      language: {
        policy: "deterministic",
        code: LanguagesEnum.English,
      },
    };
  };

// Mapping the enum values to their respective data types
type WhatsappTemplateDataMap = {
  [WhatsappTemplateNameEnum.UserMealSummary]: IUserMealSummaryData;
  [WhatsappTemplateNameEnum.ReminderToPostMealsOne]: IReminderToPostMealsOne;
  [WhatsappTemplateNameEnum.ReminderToPostMealsTwo]: IReminderToPostMealsTwo;
  [WhatsappTemplateNameEnum.ReminderToPostMealsThree]: IReminderToPostMealsThree;
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
    default: {
      throw new Error("Template not found");
    }
  }
};
