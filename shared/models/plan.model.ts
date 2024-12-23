import mongoose, { Document, Schema } from "mongoose";
import { returnAsFloat } from "../utils/mongoose";

interface IPrice {
  value: number;
  label: string;
}

export interface IPlan extends Document {
  id: string;
  name: string;
  description: string;
  type: "recurring" | "one-time";
  duration: {
    value: number;
    unit: "weeks" | "months";
  };
  currency: string;
  billingCycle?: {
    value: number; // Length of one billing cycle.
    unit: "weeks" | "months"; // Billing cycle unit.
  };
  currentPrice: IPrice;
  referencePrice?: IPrice;
  isActive: boolean; // Whether the offer is currently available
}

const PlanSchema = new Schema<IPlan>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ["recurring", "one-time"],
      required: true,
    },
    duration: {
      value: { type: Number, required: true },
      unit: {
        type: String,
        enum: ["weeks", "months"],
        required: true,
      },
    },
    currency: { type: String, required: true },
    billingCycle: {
      value: { type: Number },
      unit: {
        type: String,
        enum: ["weeks", "months"],
      },
    },
    currentPrice: {
      value: {
        type: Schema.Types.Decimal128,
        required: true,
        get: returnAsFloat,
      },
      label: { type: String, required: true },
    },
    referencePrice: {
      value: {
        type: Schema.Types.Decimal128,
        get: returnAsFloat,
      },
      label: { type: String },
    },
    isActive: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

PlanSchema.set("toJSON", {
  getters: true,
  virtuals: true,
  versionKey: false,
  transform: function (document, returnValue) {
    returnValue.id = returnValue._id;
    delete returnValue._id;
  },
});

PlanSchema.index({ id: 1 });

const Plan = mongoose.model<IPlan>("Plan", PlanSchema);

export default Plan;
