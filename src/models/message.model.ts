import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  user: string;
  payload: Object;
  createdAt: Date;
}

export interface IMessageCreate {
  user: string;
  payload: Object;
}

const MessageSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  payload: { type: Object },
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
