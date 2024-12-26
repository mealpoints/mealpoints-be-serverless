import mongoose, { Schema } from "mongoose";
import { SubscriptionStatusEnum } from "../types/enums";

export interface ISubscription extends Document {
  id: string;
  user: string;
  plan: string;
  status: SubscriptionStatusEnum;
  startedAt: Date;
  expiresAt: Date;
  comment?: string;
  canceledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubscriptionCreate {
  user: string;
  plan: string;
  status: SubscriptionStatusEnum;
  startedAt: Date;
  expiresAt: Date;
  comment?: string;
}

const SubscriptionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
    status: {
      type: String,
      enum: Object.values(SubscriptionStatusEnum),
      required: true,
    },
    startedAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
    canceledAt: { type: Date },
    comment: { type: String },
  },
  {
    timestamps: true,
  }
);

SubscriptionSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (document, returnValue) {
    returnValue.id = returnValue._id;
    delete returnValue._id;
  },
});

SubscriptionSchema.index({ id: 1, user: 1 });

const Subscription = mongoose.model<ISubscription>(
  "Subscription",
  SubscriptionSchema
);

export default Subscription;
