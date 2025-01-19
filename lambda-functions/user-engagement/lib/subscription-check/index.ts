import logger from "../../../../shared/config/logger";
import User from "../../../../shared/models/user.model";
import { SubscriptionStatusEnum } from "../../../../shared/types/enums";
import { IUserWithSubscription } from "../../../../shared/types/queueMessages";
import { enqueueUsersToSendEngagement } from "../../services/enqueue.service";
const Logger = logger("user-engagement/subscription-check");

async function getUsersWithExpiredSubscription(
  timezone: string
): Promise<IUserWithSubscription[]> {
  Logger("getUsersWithExpiredSubscription").info("");
  try {
    const usersWithExpiredSubscription: IUserWithSubscription[] =
      await User.aggregate([
        // 1. Match users with timezone
        {
          $match: {
            timezone: timezone,
          },
        },
        // 2. Lookup the active subscription for each user
        {
          $lookup: {
            from: "subscriptions",
            localField: "_id",
            foreignField: "user",
            as: "subscriptions",
          },
        },
        // 3. Unwind the subscriptions array to filter active subscriptions
        {
          $unwind: "$subscriptions",
        },
        // 4. Match users with expired subscriptions
        {
          $match: {
            "subscriptions.status": SubscriptionStatusEnum.Active,
            "subscriptions.expiresAt": { $lte: new Date() },
          },
        },
        // 5. Project the userId, subsId and planId
        {
          $project: {
            id: "$_id",
            subscription: "$subscriptions",
          },
        },
      ]);
    return usersWithExpiredSubscription;
  } catch (error) {
    Logger("getUsersWithExpiredSubscription").error(JSON.stringify(error));
    throw error;
  }
}

export const subscriptionCheckFlow = async (timezone: string) => {
  Logger("subscriptionCheckFlow").info("Running subscription check flow");
  try {
    const usersWithExpiredSubscription = await getUsersWithExpiredSubscription(
      timezone
    );
    Logger("subscriptionCheckFlow").info(
      `Found ${usersWithExpiredSubscription.length} users with expired subscription`
    );

    if (usersWithExpiredSubscription.length === 0) return;

    await enqueueUsersToSendEngagement(
      usersWithExpiredSubscription,
      "subscription_expired"
    );
  } catch (error) {
    Logger("subscriptionCheckFlow").error(JSON.stringify(error));
    throw error;
  }
};
