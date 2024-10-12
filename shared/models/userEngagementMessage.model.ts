import mongoose, { Document, Schema } from "mongoose";
import { userEngagementMessageTypesEnum } from "../types/enums";

export interface IUserEngagementMessage extends Document {
    id: string;
    user: string;
    content: string;
    type: userEngagementMessageTypesEnum;
    createdAt: Date;
}

export interface IUserEngagementMessageCreate {
    user: string;
    content: string;
    type: userEngagementMessageTypesEnum;
}

const UserEngagementMessageSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    type: { type: String, enum: Object.values(userEngagementMessageTypesEnum), required: true },
    createdAt: { type: Date, default: Date.now },
});

const UserEngagementMessage = mongoose.model<IUserEngagementMessage>("UserEngagementMessage", UserEngagementMessageSchema);

export default UserEngagementMessage;