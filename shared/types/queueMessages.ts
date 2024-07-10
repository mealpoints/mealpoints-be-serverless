import { WebhookObject } from "./message";

export interface IMessage {
  body: WebhookObject;
}

export interface IDequeuedMessage extends IMessage {
  id: string;
  receiptHandle: string;
}
