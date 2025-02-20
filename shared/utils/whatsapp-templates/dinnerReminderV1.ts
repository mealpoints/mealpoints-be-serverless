import {
  ComponentTypesEnum,
  LanguagesEnum,
  WhatsappTemplateNameEnum,
} from "../../types/enums";
import { MessageTemplateObject } from "../../types/message";

export interface IDinnerReminderV1 {}

export const createDinnerReminderV1Template =
  (): MessageTemplateObject<ComponentTypesEnum> => {
    return {
      name: WhatsappTemplateNameEnum.DinnerReminderV1,
      language: {
        policy: "deterministic",
        code: LanguagesEnum.English,
      },
    };
  };
