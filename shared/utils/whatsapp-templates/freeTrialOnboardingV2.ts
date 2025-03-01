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

export interface IFreeTrailOnboardingV2Data {
  trailDuration: string;
}

export const createFreeTrialOnboardingV2Template = (
  data: IFreeTrailOnboardingV2Data
): MessageTemplateObject<ComponentTypesEnum> => {
  return {
    name: WhatsappTemplateNameEnum.FreeTrialOnboardingV2,
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
      {
        type: ComponentTypesEnum.Body,
        parameters: [
          {
            type: ParametersTypesEnum.Text,
            text: data.trailDuration,
          },
        ],
      },
    ],
  };
};
