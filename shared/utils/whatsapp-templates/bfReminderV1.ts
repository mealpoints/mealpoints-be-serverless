import {
  ComponentTypesEnum,
  LanguagesEnum,
  WhatsappTemplateNameEnum,
} from "../../types/enums";
import { MessageTemplateObject } from "../../types/message";

export interface IBreakfastReminderV1 {}

export const createBreakfastReminderV1Template =
  (): MessageTemplateObject<ComponentTypesEnum> => {
    return {
      name: WhatsappTemplateNameEnum.BreakfastReminderV1,
      language: {
        policy: "deterministic",
        code: LanguagesEnum.English,
      },
    };
  };
