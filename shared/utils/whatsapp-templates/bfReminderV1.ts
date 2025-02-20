import {
  ComponentTypesEnum,
  LanguagesEnum,
  WhatsappTemplateNameEnum,
} from "../../types/enums";
import { MessageTemplateObject } from "../../types/message";

export interface IBFReminderV1 {}

export const createBFReminderV1Template =
  (): MessageTemplateObject<ComponentTypesEnum> => {
    return {
      name: WhatsappTemplateNameEnum.BFReminderV1,
      language: {
        policy: "deterministic",
        code: LanguagesEnum.English,
      },
    };
  };
