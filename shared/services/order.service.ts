import { FilterQuery, PopulateOption } from "mongoose";
import logger from "../config/logger";
import * as razorpay from "../handlers/razorpay.handler";
import Order, { IOrder, IOrderCreate } from "../models/order.model";
import { PaymentGatewaysEnum } from "../types/enums";

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
      status: "created",
      gateway: PaymentGatewaysEnum.Razorpay,
      metadata: data.metadata,
    });

    return order;
  } catch (error) {
    Logger("createOrder").error("%o", error);
    throw error;
  }
};

export const getOrderById = async (orderId: string) => {
  try {
    Logger("getOrderById").info(orderId);
    const order = await Order.findById(orderId);
    return order;
  } catch (error) {
    Logger("getOrderById").error("%o", error);
    throw error;
  }
};

export const findAndUpdateOrder = async (
  filter: FilterQuery<IOrder>,
  data: Partial<IOrderCreate>
) => {
  try {
    Logger("findAndUpdateOrder").info("%o", { filter, data });
    const order = await Order.findOneAndUpdate(filter, data, { new: true });
    return order;
  } catch (error) {
    Logger("findAndUpdateOrder").error("%o", error);
    throw error;
  }
};

export const findOrder = async (
  query: Partial<IOrder>,
  populate?: PopulateOption
) => {
  try {
    Logger("findOrder").info("%o", query);
    const order = await Order.findOne(query, undefined, populate);
    return order;
  } catch (error) {
    Logger("findOrder").error("%o", error);
    throw error;
  }
};
