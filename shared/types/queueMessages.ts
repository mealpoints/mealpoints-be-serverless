import { IUser } from "../models/user.model";
import { IUserMeal } from "../models/userMeal.model";
import { WhastappWebhookObject } from "./message";

export interface IMessage {
  body: WhastappWebhookObject;
}

export interface IDequeuedMessage extends IMessage {
  id: string;
  receiptHandle: string;
}

export interface IUsersToSendSummaries {
  user: IUser;
  meals: IUserMeal[];
}

export interface IUsersToSendReminders {
  user: IUser;
  remindersCount: number;
}
