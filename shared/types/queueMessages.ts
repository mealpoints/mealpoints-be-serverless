import { WhastappWebhookObject } from "./message";
import { IUser } from "../models/user.model";
import { IUserMeal } from "../models/userMeal.model";

export interface IMessage {
  body: WhastappWebhookObject;
}

export interface IDequeuedMessage extends IMessage {
  id: string;
  receiptHandle: string;
}

export interface IUserWithMeals {
  user: IUser;
  meals: IUserMeal[];
}

export interface IUserWithLastMeal{
  user: IUser;
  lastMeal: IUserMeal;
}