import {
  ComponentTypesEnum,
  LanguagesEnum,
  WhatsappTemplateNameEnum,
} from "../../types/enums";
import { MessageTemplateObject } from "../../types/message";

export interface IFeatIntro_MealViaText {}

export const createFeatIntro_MealViaTextTemplate =
  (): MessageTemplateObject<ComponentTypesEnum> => {
    return {
      name: WhatsappTemplateNameEnum.FeatIntro_MealViaText,
      language: {
        policy: "deterministic",
        code: LanguagesEnum.English,
      },
    };
  };
