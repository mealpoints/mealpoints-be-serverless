import {
  ComponentTypesEnum,
  LanguagesEnum,
  ParametersTypesEnum,
  WhatsappTemplateNameEnum,
} from "../../types/enums";
import { MessageTemplateObject } from "../../types/message";

export interface IUserMealReportData {
  mealReportId: string;
}

export const createUserMealReportTemplate = (
  data: IUserMealReportData
): MessageTemplateObject<ComponentTypesEnum> => {
  return {
    name: WhatsappTemplateNameEnum.UserMealReport,
    language: {
      policy: "deterministic",
      code: LanguagesEnum.English,
    },
    components: [
      {
        type: ComponentTypesEnum.Button,
        parameters: [
          {
            type: ParametersTypesEnum.Text,
            text: data.mealReportId,
          },
        ],
      },
    ],
  };
};
