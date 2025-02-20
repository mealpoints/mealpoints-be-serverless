import { ISubscription } from "../models/subscription.model";
import { IUser } from "../models/user.model";
import { UserEngagementMessageTypesEnum } from "./enums";
import { WhastappWebhookObject } from "./message";

export interface IMessage {
  body: WhastappWebhookObject;
}

export interface IDequeuedMessage extends IMessage {
  id: string;
  receiptHandle: string;
}

export interface IUserToSendReminders {
  user: IUser;
  remindersCount: number;
}

export interface IUserWithSubscription extends Partial<IUser> {
  id: string;
  subscription: ISubscription;
}

export interface IUserWithBLDReminderType extends Partial<IUser> {
  id: string;
  bldReminderType: UserEngagementMessageTypesEnum;
}
