import mongoose, { Document, Schema } from "mongoose";
import { WebhookTypesEnum } from "../types/enums";

export interface IRecievedMessage extends Document {
  id: string;
  user: string;
  payload: object;
  type: WebhookTypesEnum;
  media?: string;
  wamid: string;
  createdAt: Date;
}

export interface IRecievedMessageCreate {
  user: string;
  payload: object;
  wamid: string;
  media?: string;
  type: WebhookTypesEnum;
}

const ReceivedMessageSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  payload: { type: Object, required: true },
  media: { type: String },
  type: { type: String, enum: Object.values(WebhookTypesEnum), required: true },
  wamid: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

ReceivedMessageSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (document, returnValue) {
    returnValue.id = returnValue._id;
    delete returnValue._id;
  },
});

const RecievedMessage = mongoose.model<IRecievedMessage>(
  "RecievedMessage",
  ReceivedMessageSchema
);

export default RecievedMessage;
