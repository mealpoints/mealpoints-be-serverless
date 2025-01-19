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

export interface IUserPreferencesV1Data {}
export const createUserPreferencesV1Template =
  (): MessageTemplateObject<ComponentTypesEnum> => {
    return {
      name: WhatsappTemplateNameEnum.UserPreferencesV1,
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
                flow_token: WhatsappFlowEnum.UserPreferencesV1,
              },
            },
          ],
        },
      ],
    };
  };
