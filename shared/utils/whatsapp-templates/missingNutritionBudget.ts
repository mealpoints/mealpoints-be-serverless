import {
  ButtonPositionEnum,
  ButtonTypesEnum,
  ComponentTypesEnum,
  LanguagesEnum,
  ParametersTypesEnum,
  WhatsappFlowEnum,
  WhatsappTemplateNameEnum,
} from "../../types/enums";
import { MessageTemplateObject } from "../../types/message";

export interface IMissingNutritionBudgetData {}

export const createMissingNutritionBudgetTemplate =
  (): MessageTemplateObject<ComponentTypesEnum> => {
    return {
      name: WhatsappTemplateNameEnum.MissingNutritionBudget,
      language: {
        policy: "deterministic",
        code: LanguagesEnum.English,
      },
      components: [
        {
          type: ComponentTypesEnum.Button,
          sub_type: ButtonTypesEnum.Flow,
          index: ButtonPositionEnum.First,
          parameters: [
            {
              type: ParametersTypesEnum.Action,
              action: {
                flow_token: WhatsappFlowEnum.OnboardingV1,
              },
            },
          ],
        },
      ],
    };
  };
