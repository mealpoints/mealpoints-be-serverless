import mongoose, { Schema } from "mongoose";
import {
  ComponentTypesEnum,
  MessageTypesEnum,
  StatusEnum,
} from "../types/enums";
import {
  InteractiveMessageBodyOptions,
  MessageTemplateObject,
} from "../types/message";

export interface ISentMessage extends Document {
  id: string;
  user: string;
  payload?: string;
  interactive?: InteractiveMessageBodyOptions;
  template?: MessageTemplateObject<ComponentTypesEnum>;
  type: MessageTypesEnum;
  status: StatusEnum;
  wamid?: string;
  media?: string;
  createdAt: Date;
}

export interface ISentMessageCreate {
  user: string;
  payload?: string;
  interactive?: InteractiveMessageBodyOptions;
  template?: MessageTemplateObject<ComponentTypesEnum>;
  type: MessageTypesEnum;
  wamid?: string;
  media?: string;
  status?: StatusEnum;
}

const SentMessageSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  payload: { type: String },
  interactve: { type: Schema.Types.Mixed },
  template: { type: Schema.Types.Mixed },
  status: {
    type: String,
    enum: Object.values(StatusEnum),
    default: StatusEnum.Sent,
  },
  wamid: { type: String },
  media: { type: String },
  type: { type: String, enum: Object.values(MessageTypesEnum), required: true },
  createdAt: { type: Date, default: Date.now },
});

SentMessageSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (document, returnValue) {
    returnValue.id = returnValue._id;
    delete returnValue._id;
  },
});

const SentMessage = mongoose.model<ISentMessage>(
  "SentMessage",
  SentMessageSchema
);

export default SentMessage;
