import mongoose, { Schema } from "mongoose";

export interface IConversation extends Document {
  id: string;
  user: string;
  openaiThreadId?: string;
  createdAt: Date;
}

export interface IConversationCreate {
  openaiThreadId?: string;
  user: string;
}

const ConversationSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  openaiThreadId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Conversation = mongoose.model<IConversation>(
  "Conversation",
  ConversationSchema
);

export default Conversation;
