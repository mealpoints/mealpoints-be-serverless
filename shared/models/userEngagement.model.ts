import mongoose, { Document, Schema } from "mongoose";
import { userEngagementAlertTypesEnum } from "../types/enums";

export interface IUserEngagementAlert extends Document {
    id: string;
    user: string;
    content: string;
    type: userEngagementAlertTypesEnum;
    createdAt: Date;
}

export interface IUserEngagementAlertCreate {
    user: string;
    content: string;
    type: userEngagementAlertTypesEnum;
}

const UserEngagementAlertSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    type: { type: String, enum: Object.values(userEngagementAlertTypesEnum), required: true },
    createdAt: { type: Date, default: Date.now },
});

const UserEngagementAlert = mongoose.model<IUserEngagementAlert>("UserEngagementAlert", UserEngagementAlertSchema);

export default UserEngagementAlert;