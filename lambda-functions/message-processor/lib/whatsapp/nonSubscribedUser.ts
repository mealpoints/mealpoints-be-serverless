import { USER_MESSAGES } from "../../../../shared/config/config";
import logger from "../../../../shared/config/logger";
import { ISubscription } from "../../../../shared/models/subscription.model";
import { IUser } from "../../../../shared/models/user.model";
import * as messageService from "../../../../shared/services/message.service";
import {
  MessageTypesEnum,
  SubscriptionStatusEnum,
} from "../../../../shared/types/enums";

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
    await sendMessage(USER_MESSAGES.info.user_not_subscribed);
    return;
  }

  switch (subscription.status) {
    case SubscriptionStatusEnum.Expired: {
      await sendMessage(USER_MESSAGES.info.subscription.expired);
      break;
    }
    case SubscriptionStatusEnum.Paused: {
      const renewalMessage = USER_MESSAGES.info.subscription.paused(
        subscription.plan,
        user.contact
      );
      await sendMessage(renewalMessage);
      break;
    }
    default: {
      await sendMessage(USER_MESSAGES.info.user_not_subscribed);
      break;
    }
  }
};
