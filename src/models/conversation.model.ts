import mongoose, { Schema } from "mongoose";

export interface IConversation extends Document {
  id: string;
  user: string;
  createdAt: Date;
}

export interface IConversationCreate {
  user: string;
}

const ConversationSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const Conversation = mongoose.model<IConversation>(
  "Conversation",
  ConversationSchema
);

export default Conversation;
