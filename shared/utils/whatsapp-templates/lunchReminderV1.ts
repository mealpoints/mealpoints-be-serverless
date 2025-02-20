import {
  ComponentTypesEnum,
  LanguagesEnum,
  WhatsappTemplateNameEnum,
} from "../../types/enums";
import { MessageTemplateObject } from "../../types/message";

export interface ILunchReminderV1 {}

export const createLunchReminderV1Template =
  (): MessageTemplateObject<ComponentTypesEnum> => {
    return {
      name: WhatsappTemplateNameEnum.LunchReminderV1,
      language: {
        policy: "deterministic",
        code: LanguagesEnum.English,
      },
    };
  };
