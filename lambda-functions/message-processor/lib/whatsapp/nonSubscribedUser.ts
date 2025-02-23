import { USER_MESSAGES } from "../../../../shared/config/config";
import logger from "../../../../shared/config/logger";
import SettingsSingleton from "../../../../shared/config/settings";
import { ISubscription } from "../../../../shared/models/subscription.model";
import { IUser } from "../../../../shared/models/user.model";
import * as messageService from "../../../../shared/services/message.service";
import { getPlanById } from "../../../../shared/services/plan.service";
import {
  MessageTypesEnum,
  SubscriptionStatusEnum,
} from "../../../../shared/types/enums";
import { IProcessOnboardUser, processOnboardUser } from "../onboard-user";

const Logger = logger("lib/whatsapp/handleNonSubscribedUser");

export const handleNonSubscribedUser = async (
  user: IUser,
  subscription: ISubscription | null
) => {
  Logger("handleNonSubscribedUser").info("");
  const userId = user.id;

  // TODO: Replace it with WA template once available,
  const sendMessage = async (message: string) => {
    await messageService.sendTextMessage({
      user: userId,
      payload: message,
      type: MessageTypesEnum.Text,
    });
  };

  if (!subscription) {
    return handleUserWithoutAnySubscription(user);
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
      await sendMessage(USER_MESSAGES.info.user_not_subscribed);
      break;
    }
  }
};

const handleUserWithoutAnySubscription = async (user: IUser) => {
  Logger("handleUserWithoutAnySubscription").info("");

  try {
    const settings = await SettingsSingleton.getInstance();
    const activeFreeTrailPlanId = settings.get("free-trial.plan") as string;

    if (activeFreeTrailPlanId && activeFreeTrailPlanId.trim() !== "") {
      const plan = await getPlanById(activeFreeTrailPlanId);
      if (plan) {
        const onboardingData = {
          user,
          plan,
          createdAt: new Date(),
        } as IProcessOnboardUser;
        await processOnboardUser(onboardingData);
        return;
      } else {
        Logger("handleUserWithoutAnySubscription").info(
          "Free trail plan not found, Sending subscription based service notice to user"
        );
      }
    } else {
      Logger("handleUserWithoutAnySubscription").info(
        "No active free trail plan id found in settings, Sending subscription based service notice to user"
      );
    }

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
    return;
  } catch (error) {
    Logger("handleUserWithoutAnySubscription").error(JSON.stringify(error));
    await messageService.sendTextMessage({
      user: user.id,
      payload: USER_MESSAGES.errors.text_not_processed,
      type: MessageTypesEnum.Text,
    });
    throw error;
  }
};
