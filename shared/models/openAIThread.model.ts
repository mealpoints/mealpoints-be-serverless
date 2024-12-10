import mongoose, { Schema } from "mongoose";

export interface IOpenAIThread extends Document {
  id: string;
  user: string;
  threadId?: string;
  assistantId?: string;
  createdAt: Date;
}

export interface IOpenAIThreadCreate {
  threadId: string;
  assistantId: string;
  user: string;
}

const OpenAIThreadSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  threadId: { type: String, required: true, index: true },
  assistantId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

OpenAIThreadSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (document, returnValue) {
    returnValue.id = returnValue._id;
    delete returnValue._id;
  },
});

const OpenAIThread = mongoose.model<IOpenAIThread>(
  "OpenAIThread",
  OpenAIThreadSchema
);

export default OpenAIThread;
