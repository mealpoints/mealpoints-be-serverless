import logger from "../../config/logger";
import {
  ComponentTypesEnum,
  LanguagesEnum,
  WhatsappTemplateNameEnum,
} from "../../types/enums";
import { MessageTemplateObject } from "../../types/message";

const Logger = logger("whatsapp-templates/onboard-user");

export interface IWelcomeMessageData {}

export const createWelcomeMessageTemplate =
  (): MessageTemplateObject<ComponentTypesEnum> => {
    Logger("createWelcomeMessageTemplate").info(``);
    return {
      name: WhatsappTemplateNameEnum.WelcomeMessage,
      language: {
        policy: "deterministic",
        code: LanguagesEnum.English,
      },
    };
  };
