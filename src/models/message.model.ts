import mongoose, { Schema, Document, Mongoose } from "mongoose";

export interface IMessage extends Document {
  user: string;
  message: Object;
  createdAt: Date;
}

export interface IMessageCreate {
  user: string;
  message: Object;
}

const MessageSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  message: { type: Object },
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
