import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  sender: string;
  text?: string;
  imageUrl?: string;
  timestamp: Date;
}

const MessageSchema: Schema = new Schema({
  sender: { type: String, required: true },
  text: { type: String },
  imageUrl: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
