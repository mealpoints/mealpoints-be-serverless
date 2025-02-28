import {
  ComponentTypesEnum,
  LanguagesEnum,
  ParametersTypesEnum,
  WhatsappTemplateNameEnum,
} from "../../types/enums";
import { MessageTemplateObject } from "../../types/message";

export interface IFreeTrailOnboardingV1Data {
  trailDuration: string;
}

export const createFreeTrialOnboardingV1Template = (
  data: IFreeTrailOnboardingV1Data
): MessageTemplateObject<ComponentTypesEnum> => {
  return {
    name: WhatsappTemplateNameEnum.FreeTrialOnboardingV1,
    language: {
      policy: "deterministic",
      code: LanguagesEnum.English,
    },
    components: [
      {
        type: ComponentTypesEnum.Header,
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
