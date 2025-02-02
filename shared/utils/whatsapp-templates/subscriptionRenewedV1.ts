import {
  ComponentTypesEnum,
  LanguagesEnum,
  WhatsappTemplateNameEnum,
} from "../../types/enums";
import { MessageTemplateObject } from "../../types/message";

export interface ISubscriptionRenewedV1Data {}

export const createSubscriptionRenewedV1Template =
  (): MessageTemplateObject<ComponentTypesEnum> => {
    return {
      name: WhatsappTemplateNameEnum.SubscriptionRenewedV1,
      language: {
        policy: "deterministic",
        code: LanguagesEnum.English,
      },
    };
  };
