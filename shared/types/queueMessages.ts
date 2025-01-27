import { IUser } from "../models/user.model";
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
