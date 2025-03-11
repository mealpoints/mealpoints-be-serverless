import { analytics } from "../../../../shared/config/analytics";
import { USER_MESSAGES } from "../../../../shared/config/config";
import logger from "../../../../shared/config/logger";
import SettingsSingleton from "../../../../shared/config/settings";
import { sendInternalAlert } from "../../../../shared/libs/internal-alerts";
import { activateSubscription } from "../../../../shared/libs/subscription";
import { ISubscription } from "../../../../shared/models/subscription.model";
import { IUser } from "../../../../shared/models/user.model";
import * as messageService from "../../../../shared/services/message.service";
import { getPlanById } from "../../../../shared/services/plan.service";
import {
  MessageTypesEnum,
  SubscriptionStatusEnum,
  WhatsappTemplateNameEnum,
} from "../../../../shared/types/enums";
import { createWhatsappTemplate } from "../../../../shared/utils/whatsapp-templates";

const Logger = logger("lib/whatsapp/handleNonSubscribedUser");

export const handleNonSubscribedUser = async (
  user: IUser,
  subscription: ISubscription | null
) => {
  Logger("handleNonSubscribedUser").info("");
  const userId = user.id;

  if (!subscription) {
    return handleUserWithoutAnyPastSubscriptions(user);
  }

  switch (subscription.status) {
    case SubscriptionStatusEnum.Expired: {
      await messageService.sendInteractiveMessage({
        user: userId,
        type: MessageTypesEnum.Interactive,
        interactive: {
          type: "cta_url",
          header: {
            type: "text",
            text: USER_MESSAGES.info.subscription.expired_header,
          },
          body: {
            text: USER_MESSAGES.info.subscription.expired,
          },
          action: {
            name: "cta_url",
            parameters: {
              display_text: "Click here",
              url: `${process.env.MEALPOINTS_BASE_URL}`,
            },
          },
        },
      });
      break;
    }
    case SubscriptionStatusEnum.Paused: {
      await messageService.sendInteractiveMessage({
        user: userId,
        type: MessageTypesEnum.Interactive,
        interactive: {
          type: "cta_url",
          header: {
            type: "text",
            text: USER_MESSAGES.info.subscription.paused_header,
          },
          body: {
            text: USER_MESSAGES.info.subscription.paused,
          },
          action: {
            name: "cta_url",
            parameters: {
              display_text: "Click here",
              url: `${process.env.MEALPOINTS_BASE_URL}?planId=${subscription.plan}&contact=${user.contact}`,
            },
          },
        },
      });
      break;
    }
    default: {
      await messageService.sendTextMessage({
        user: userId,
        payload: USER_MESSAGES.info.user_not_subscribed,
        type: MessageTypesEnum.Text,
      });
    }
  }
};

const handleUserWithoutAnyPastSubscriptions = async (user: IUser) => {
  Logger("handleUserWithoutAnyPastSubscriptions").info("");

  try {
    const settings = await SettingsSingleton.getInstance();
    const activeFreeTrialPlanId = settings.get("free-trial.plan") as string;

    // If plan does not exist, send a generic message to the user
    if (!activeFreeTrialPlanId || activeFreeTrialPlanId.trim() === "") {
      Logger("handleUserWithoutAnyPastSubscriptions").error(
        "No active free Trial plan id found in settings, Sending subscription based service notice to user"
      );
      await messageService.sendInteractiveMessage({
        user: user.id,
        type: MessageTypesEnum.Interactive,
        interactive: {
          type: "cta_url",
          header: {
            type: "text",
            text: USER_MESSAGES.info.subscription.not_subscribed_header,
          },
          body: {
            text: USER_MESSAGES.info.subscription.not_subscribed,
          },
          action: {
            name: "cta_url",
            parameters: {
              display_text: "Click here",
              url: `${process.env.MEALPOINTS_BASE_URL}`,
            },
          },
        },
      });
    }

    const plan = await getPlanById(activeFreeTrialPlanId);
    if (!plan) {
      Logger("handleUserWithoutAnyPastSubscriptions").error(
        `Free Trial plan with id ${activeFreeTrialPlanId} not found`
      );
      throw new Error("Free Trial plan not found");
    }

    const subscription = await activateSubscription({
      user,
      plan,
    });

    if (!subscription) {
      Logger("handleUserWithoutAnyPastSubscriptions").error(
        "Failed to activate subscription"
      );
      await sendInternalAlert({
        message: `Failed to activate free trial subscription for user with id: ${user.id} and contact: ${user.contact}`,
        severity: "critical",
      });
      throw new Error("Failed to activate subscription");
    }

    // TODO: Might use this later

    // await messageService.sendTemplateMessage({
    //   user: user.id,
    //   type: MessageTypesEnum.Template,
    //   template: createWhatsappTemplate(
    //     WhatsappTemplateNameEnum.FreeTrialOnboardingV2,
    //     {
    //       trailDuration: getHumanReadablePlanDuration(plan.duration),
    //     }
    //   ),
    // });

    await messageService.sendTemplateMessage({
      user: user.id,
      type: MessageTypesEnum.Template,
      template: createWhatsappTemplate(
        WhatsappTemplateNameEnum.FreeTrialOnboardingV4,
        {}
      ),
    });

    analytics.capture({
      distinctId: user.id,
      event: "free_trial_activated",
      properties: {
        onboardingTemplate: WhatsappTemplateNameEnum.FreeTrialOnboardingV4,
        ...plan,
      },
    });
  } catch (error) {
    Logger("handleUserWithoutAnyPastSubscriptions").error(
      JSON.stringify(error)
    );
    await messageService.sendTextMessage({
      user: user.id,
      payload: USER_MESSAGES.errors.text_not_processed,
      type: MessageTypesEnum.Text,
    });
    throw error;
  }
};
