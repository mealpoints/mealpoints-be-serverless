import { USER_MESSAGES } from "../../../config/config";
import logger from "../../../config/logger";
import { IOrder } from "../../../models/order.model";
import { ISubscription } from "../../../models/subscription.model";
import { IUser } from "../../../models/user.model";
import * as messageService from "../../../services/message.service";
import * as orderService from "../../../services/order.service";
import * as subscriptionService from "../../../services/subscription.service";
import { MessageTypesEnum, SubscriptionStatusEnum } from "../../../types/enums";
import { sendInternalAlert } from "../../internal-alerts";
import * as userMessages from "./userMessages";
import { isValidSubscription } from "./validSubscription";

const Logger = logger("shared/libs/commands/refund");

export const refundRequested = async (user: IUser) => {
  Logger("refundRequested").info("");
  try {
    const subscription = await subscriptionService.getSubscriptionByUserId(
      user.id
    );

    if (!(await isValidSubscription(user, subscription))) {
      Logger("refundRequested").error("No subscription found");

      return await messageService.sendTextMessage({
        user: user.id,
        payload: USER_MESSAGES.errors.refund.subscription_not_found,
        type: MessageTypesEnum.Text,
      });
    }

    // @ts-expect-error - We know that subscription exists
    const planId = subscription.plan;

    // Get paymentId
    const latestOrder = await orderService.findOrder(
      {
        user: user.id,
        plan: planId,
      },
      {
        sort: { createdAt: -1 },
      }
    );

    if (!latestOrder) {
      Logger("refundRequested").error("No order found");
      await sendInternalAlert({
        message: `No order found for user ${user.id}`,
        severity: "major",
      });
      throw new Error("No order found");
    }
  } catch (error) {
    Logger("refundRequested").error(JSON.stringify(error));
    throw error;
  }
};

export const refundConfirmed = async (user: IUser) => {
  Logger("refundConfirmed").info("");
  try {
    // At this point we know that the user is eligible for a refund.

    // We get the paymentId from the latest order.
    const subscription = (await subscriptionService.getSubscriptionByUserId(
      user.id
    )) as ISubscription;

    const latestOrder = (await orderService.findOrder(
      {
        user: user.id,
        plan: subscription.plan,
      },
      {
        sort: { createdAt: -1 },
      }
    )) as IOrder;

    // We then call the payment gateway to refund the payment.
    const refund = await orderService.issueRefund(latestOrder.paymentId);

    if (!refund) {
      Logger("refundConfirmed").error("Refund failed");

      throw new Error("Refund failed");
    }

    // We then update the subscription to inactive and set the cancelledAt date.
    await subscriptionService.updateSubscriptionById(subscription.id, {
      status: SubscriptionStatusEnum.Cancelled,
      cancelledAt: new Date(),
      comment: "Subscription cancelled by user",
    });

    // We then send a message to the user that the refund has been processed.
    await userMessages.refundProcessed(user);
  } catch (error) {
    Logger("refundConfirmed").error(JSON.stringify(error));
    await sendInternalAlert({
      message: `Refund failed for user ${user.id}`,
      severity: "major",
    });
    throw error;
  }
};

export const refundRejectedByUser = async (user: IUser) => {
  Logger("refundRejected").info("");
  await userMessages.refundRejectedByUserMessage(user);
};
