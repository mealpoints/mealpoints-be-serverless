import mongoose, { Document, Schema } from "mongoose";
import { WebhookTypesEnum } from "../types/enums";

export interface IRecievedMessage extends Document {
  id: string;
  user: string;
  payload: object;
  conversation: string;
  type: WebhookTypesEnum;
  createdAt: Date;
}

export interface IRecievedMessageCreate {
  user: string;
  payload: object;
  conversation: string;
  type: WebhookTypesEnum;
}

const ReceivedMessageSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  payload: { type: Object, required: true },
  conversation: {
    type: Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  type: { type: String, enum: Object.values(WebhookTypesEnum), required: true },
  createdAt: { type: Date, default: Date.now },
});

const RecievedMessage = mongoose.model<IRecievedMessage>(
  "RecievedMessage",
  ReceivedMessageSchema
);

export default RecievedMessage;
