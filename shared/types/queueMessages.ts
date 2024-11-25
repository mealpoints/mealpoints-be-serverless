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

export enum QUEUE_MESSAGE_GROUP_IDS {
  whatsapp_messages = "whatsapp_messages",
  meal_summary = "meal_summary",
  meal_report = "meal_report",
  reminder = "reminder",
}

export interface IUsersToSendSummaries {
  user: IUser;
  meals: IUserMeal[];
  messageGroupId: QUEUE_MESSAGE_GROUP_IDS.meal_summary;
}

export interface IUsersToSendReminders {
  user: IUser;
  remindersCount: number;
  messageGroupId: QUEUE_MESSAGE_GROUP_IDS.reminder;
}

export interface IUsersToSendMealReports {
  user: IUser;
  meals: IUserMeal[];
  messageGroupId: QUEUE_MESSAGE_GROUP_IDS.meal_report;
}
