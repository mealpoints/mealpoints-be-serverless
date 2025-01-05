import crypto from "node:crypto";
import Razorpay from "razorpay";
import { v4 as uuidv4 } from "uuid";
import logger from "../config/logger";

const Logger = logger("razorpay.handler");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

interface ICreateOrder {
  amount: number;
  currency: string;
}

export const createOrder = async ({ amount, currency }: ICreateOrder) => {
  Logger("createOrder").info("%o", { amount, currency });

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Weird razorpay API requirement that we need to multiply by 100
      currency,
      receipt: uuidv4(),
    });
    return order;
  } catch (error) {
    Logger("createOrder").error(JSON.stringify(error));
    throw error;
  }
};

export const isSignatureValid = (
  signature: string,
  paymentId: string,
  orderId: string
) => {
  Logger("validatePayment").info("");
  const sign = orderId + "|" + paymentId;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
    .update(sign.toString())
    .digest("hex");
  return signature === expectedSign;
};

export const refundPayment = async (paymentId: string, amount?: number) => {
  Logger("refundPayment").info("");
  try {
    const refund = await razorpay.payments.refund(paymentId, {
      receipt: uuidv4(),
      speed: "optimum",
      ...(amount && { amount: amount * 100 }), // Amount is needed only in case of partial refund.
    });

    return refund;
  } catch (error) {
    Logger("refundPayment").error(JSON.stringify(error));
    throw error;
  }
};
