import {
  ComponentTypesEnum,
  LanguagesEnum,
  ParametersTypesEnum,
  WhatsappTemplateNameEnum,
} from "../../types/enums";
import { MessageTemplateObject } from "../../types/message";

export interface IUserMealSummaryData {
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

export const createUserMealSummaryTemplate = (
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
