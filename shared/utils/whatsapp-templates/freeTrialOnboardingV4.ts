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

export interface IFreeTrailOnboardingV4Data {}

export const createFreeTrialOnboardingV4Template =
  (): MessageTemplateObject<ComponentTypesEnum> => {
    return {
      name: WhatsappTemplateNameEnum.FreeTrialOnboardingV4,
      language: {
        policy: "deterministic",
        code: LanguagesEnum.English,
      },
      components: [
        {
          type: ComponentTypesEnum.Header,
          parameters: [
            {
              type: ParametersTypesEnum.Video,
              video: {
                link: "https://mealpoints-dev.s3.ap-south-1.amazonaws.com/assets/ads/activationvid.mp4",
              },
            },
          ],
        },
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
