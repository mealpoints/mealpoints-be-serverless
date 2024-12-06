import mongoose, { Document, Schema } from "mongoose";
import { UserEngagementMessageTypesEnum } from "../types/enums";

export interface IUserEngagementMessage extends Document {
  id: string;
  user: string;
  content: string;
  type: UserEngagementMessageTypesEnum;
  createdAt: Date;
}

export interface IUserEngagementMessageCreate {
  user: string;
  content: string;
  type: UserEngagementMessageTypesEnum;
}

const UserEngagementMessageSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  type: {
    type: String,
    enum: Object.values(UserEngagementMessageTypesEnum),
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const UserEngagementMessage = mongoose.model<IUserEngagementMessage>(
  "UserEngagementMessage",
  UserEngagementMessageSchema
);

UserEngagementMessageSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (document, returnValue) {
    returnValue.id = returnValue._id;
    delete returnValue._id;
  },
});

export default UserEngagementMessage;
