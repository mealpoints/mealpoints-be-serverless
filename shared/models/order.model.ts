import mongoose, { Schema } from "mongoose";
import { OrderStatusEnum, PaymentGatewaysEnum } from "../types/enums";
import { returnAsFloat } from "../utils/mongoose";

export interface IOrder extends Document {
  id: string;
  user: string;
  amount: number;
  paymentGatewayOrderId: string;
  paymentId: string;
  plan: string;
  currency: string;
  status: OrderStatusEnum;
  gateway: PaymentGatewaysEnum;
  metadata?: object;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderCreate {
  user: string;
  amount: number;
  paymentGatewayOrderId: string;
  paymentId: string;
  plan: string;
  currency: string;
  status: OrderStatusEnum;
  gateway: PaymentGatewaysEnum;
  metadata?: object;
}

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
    amount: {
      type: Schema.Types.Decimal128,
      get: returnAsFloat,
      required: true,
    },
    paymentGatewayOrderId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
    },
    currency: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(OrderStatusEnum),
      required: true,
    },
    gateway: {
      type: String,
      enum: Object.values(PaymentGatewaysEnum),
      required: true,
    },
    metadata: { type: Object },
  },
  {
    timestamps: true,
  }
);

OrderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (document, returnValue) {
    returnValue.id = returnValue._id;
    delete returnValue._id;
  },
});

const Order = mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
