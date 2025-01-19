import mongoose from "mongoose";
import logger from "../../../../shared/config/logger";
import { sendInternalAlert } from "../../../../shared/libs/internal-alerts";
import { activateSubscription } from "../../../../shared/libs/subscription";
import { IOrder } from "../../../../shared/models/order.model";
import { IPlan } from "../../../../shared/models/plan.model";
import { IUser } from "../../../../shared/models/user.model";
import * as messageService from "../../../../shared/services/message.service";
import * as subscriptionService from "../../../../shared/services/subscription.service";
import * as userEngagementMessageService from "../../../../shared/services/userEngagement.service";
import {
  MessageTypesEnum,
  PlanTypeEnum,
  UserEngagementMessageTypesEnum,
  WhatsappTemplateNameEnum,
} from "../../../../shared/types/enums";
import { createWhatsappTemplate } from "../../../../shared/utils/whatsapp-templates";

const Logger = logger("lib/onboard-user");

interface IProcessOnboardUser extends Omit<IOrder, "user" | "plan"> {
  user: IUser;
  plan: IPlan;
  recurringGroupId?: string;
}

export const processOnboardUser = async (data: IProcessOnboardUser) => {
  Logger("processOnboardUser").info("%o", data);
  const { user, plan, recurringGroupId } = data;
  const order: IOrder = { ...data, user: user.id, plan: plan.id };

  try {
    // Make sure the user does not have an active subscription
    const activeSubscription = await subscriptionService.getActiveSubscription(
      user.id
    );
    if (activeSubscription) {
      Logger("activateSubscription").info(
        "User already has an active subscription"
      );
      await sendInternalAlert({
        message: `User with id ${user.id} already has an active subscription and is trying to activate another one`,
        severity: "major",
      });

      return;
    }
    let recurringGroup: string | undefined = undefined;
    if (plan.type === PlanTypeEnum.Recurring) {
      recurringGroup =
        recurringGroupId ?? new mongoose.Types.ObjectId().toString();
    }

    // Create Subscription
    await activateSubscription({
      user,
      plan,
      order,
      recurringGroup,
    });

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
  } catch {
    Logger("processOnboardUser").error(
      "Failed to process onboard user messages"
    );
    await sendInternalAlert({
      message: `Failed to onboard user with id: ${user.id} and contact: ${user.contact}`,
      severity: "critical",
    });

    throw new Error("Failed to process onboard user messages");
  }
};
