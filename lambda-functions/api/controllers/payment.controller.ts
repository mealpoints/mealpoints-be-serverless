import { Request, Response } from "express";
import * as razorypayService from "../../../shared/handlers/razorpay.handler";
import * as orderService from "../../../shared/services/order.service";
import * as planService from "../../../shared/services/plan.service";
import * as userService from "../../../shared/services/user.service";
import { OrderStatusEnum } from "../../../shared/types/enums";
import ApiResponse from "../../../shared/utils/ApiResponse";
import { catchAsync } from "../../../shared/utils/catchAsync";
import { ensureContactFormat } from "../../../shared/utils/contact";

interface createOrderRequest extends Request {
  body: {
    planId: string;
    contact: string;
  };
}

export const createOrder = catchAsync(
  async (request: createOrderRequest, response: Response) => {
    const { planId, contact } = request.body;

    const formattedContact = ensureContactFormat(contact);
    if (!formattedContact) {
      return ApiResponse.BadRequest(response, "Invalid contact number");
    }

    // Ensure user by contact
    const user = await userService.ensureUserByContact(contact);
    if (!user) {
      return ApiResponse.ServerError(response, "Failed to create user");
    }

    const plan = await planService.getPlanById(planId);
    if (!plan) {
      return ApiResponse.NotFound(response, "Plan not found");
    }

    const order = await orderService.createOrder({
      userId: user.id,
      planId,
      currency: plan.currency,
      amount: plan.currentPrice.value,
    });

    return ApiResponse.Created(response, order);
  }
);

interface validatePaymentRequest extends Request {
  body: {
    orderId: string;
    paymentId: string;
    signature: string;
  };
}

export const validatePayment = catchAsync(
  async (request: validatePaymentRequest, response: Response) => {
    const {
      orderId: paymentGatewayOrderId,
      paymentId,
      signature,
    } = request.body;

    const order = await orderService.findOrder({
      paymentGatewayOrderId,
    });
    if (!order) {
      return ApiResponse.NotFound(response, "Order not found");
    }

    if (order.status !== OrderStatusEnum.Created) {
      return ApiResponse.BadRequest(response, "Order is not in a valid state");
    }

    // Validate payment
    if (
      !razorypayService.isSignatureValid(
        signature,
        paymentId,
        paymentGatewayOrderId
      )
    ) {
      return ApiResponse.BadRequest(response, "Invalid payment signature");
    }

    await orderService.findAndUpdateOrder(
      {
        paymentGatewayOrderId,
      },
      {
        paymentId,
        status: OrderStatusEnum.Paid,
      }
    );

    return ApiResponse.Ok(response, "Order validated");
  }
);
