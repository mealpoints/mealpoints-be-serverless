import logger from "../../../../shared/config/logger";
import { IOrder } from "../../../../shared/models/order.model";
import { IPlan } from "../../../../shared/models/plan.model";
import { IUser } from "../../../../shared/models/user.model";
import * as messageService from "../../../../shared/services/message.service";
import * as userEngagementMessageService from "../../../../shared/services/userEngagement.service";
import {
  MessageTypesEnum,
  UserEngagementMessageTypesEnum,
  WhatsappTemplateNameEnum,
} from "../../../../shared/types/enums";
import { createWhatsappTemplate } from "../../../../shared/utils/whatsapp-templates";

const Logger = logger("lib/onboard-user");

interface IProcessOnboardUser extends Omit<IOrder, "user" | "plan"> {
  user: IUser;
  plan: IPlan;
}

export const processOnboardUser = async (data: IProcessOnboardUser) => {
  Logger("processOnboardUser").info("Processing onboard user messages");
  const { user } = data;
  console.log(data);

  const messageResponse = await messageService.sendTemplateMessage({
    user: user.id,
    type: MessageTypesEnum.Template,
    template: createWhatsappTemplate(
      WhatsappTemplateNameEnum.WelcomeMessage,
      {}
    ),
  });

  if (messageResponse) {
    await userEngagementMessageService.createUserEngagementMessage({
      user: user.id,
      content: `Template: ${WhatsappTemplateNameEnum.WelcomeMessage}`,
      type: UserEngagementMessageTypesEnum.Welcome,
    });
  }

  return;
};
