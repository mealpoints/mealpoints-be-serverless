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

export interface IFreeTrailOnboardingV3Data {}

export const createFreeTrialOnboardingV3Template =
  (): MessageTemplateObject<ComponentTypesEnum> => {
    return {
      name: WhatsappTemplateNameEnum.FreeTrialOnboardingV3,
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
