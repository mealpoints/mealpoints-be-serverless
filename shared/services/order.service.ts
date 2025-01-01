import { FilterQuery, PopulateOptions, QueryOptions } from "mongoose";
import logger from "../config/logger";
import * as razorpay from "../handlers/razorpay.handler";
import Order, { IOrder, IOrderCreate } from "../models/order.model";
import { OrderStatusEnum, PaymentGatewaysEnum } from "../types/enums";

const Logger = logger("order.service");

interface ICreateOrder {
  planId: string;
  userId: string;
  currency: string;
  amount: number;
  metadata?: object;
}

export const createOrder = async (data: ICreateOrder) => {
  try {
    Logger("createOrder").info("%o", data);

    const razorpayOrder = await razorpay.createOrder({
      amount: data.amount,
      currency: data.currency,
    });

    const order = await Order.create({
      user: data.userId,
      plan: data.planId,
      amount: data.amount,
      currency: data.currency,
      paymentGatewayOrderId: razorpayOrder.id,
      status: OrderStatusEnum.Created,
      gateway: PaymentGatewaysEnum.Razorpay,
      metadata: data.metadata,
    });

    return order;
  } catch (error) {
    Logger("createOrder").error(JSON.stringify(error));
    throw error;
  }
};

export const getOrderById = async (orderId: string) => {
  try {
    Logger("getOrderById").info(orderId);
    const order = await Order.findById(orderId);
    return order;
  } catch (error) {
    Logger("getOrderById").error(JSON.stringify(error));
    throw error;
  }
};

export const findAndUpdateOrder = async (
  filter: FilterQuery<IOrder>,
  data: Partial<IOrderCreate>,
  populate?: PopulateOptions
) => {
  try {
    Logger("findAndUpdateOrder").info("%o", { filter, data });
    const order = await Order.findOneAndUpdate(filter, data, {
      new: true,
    }).populate(populate?.path || "");
    return order;
  } catch (error) {
    Logger("findAndUpdateOrder").error(JSON.stringify(error));
    throw error;
  }
};

export const findOrder = async (
  query: Partial<IOrder>,
  options?: QueryOptions
) => {
  try {
    Logger("findOrder").info("");
    const order = await Order.findOne(query, undefined, options);
    return order;
  } catch (error) {
    Logger("findOrder").error(JSON.stringify(error));
    throw error;
  }
};

export const issueRefund = async (paymentId: string, amount?: number) => {
  try {
    Logger("issueRefund").info("%o", { paymentId, amount });
    const refund = await razorpay.refundPayment(paymentId, amount);
    return refund;
  } catch (error) {
    Logger("issueRefund").error(JSON.stringify(error));
    throw error;
  }
};
