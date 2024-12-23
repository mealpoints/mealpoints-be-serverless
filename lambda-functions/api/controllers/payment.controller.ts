import { Request, Response } from "express";
import logger from "../../../shared/config/logger";
import { queue } from "../../../shared/config/queue";
import * as razorypayService from "../../../shared/handlers/razorpay.handler";
import * as orderService from "../../../shared/services/order.service";
import * as planService from "../../../shared/services/plan.service";
import { SqsQueueService } from "../../../shared/services/queue.service";
import * as subscriptionService from "../../../shared/services/subscription.service";
import * as userService from "../../../shared/services/user.service";
import { OrderStatusEnum } from "../../../shared/types/enums";
import ApiResponse from "../../../shared/utils/ApiResponse";
import { catchAsync } from "../../../shared/utils/catchAsync";
import { ensureContactFormat } from "../../../shared/utils/contact";

const Logger = logger("payment.controller");

export interface ICreateOrderRequest extends Request {
  body: {
    planId: string;
    contact: string;
  };
}

export const createOrder = catchAsync(
  async (request: ICreateOrderRequest, response: Response) => {
    Logger("createOrder").info("");
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

    // Make sure the user does not have an active subscription
    const activeSubscription = await subscriptionService.getActiveSubscription(
      user.id
    );
    if (activeSubscription) {
      return ApiResponse.Conflict(
        response,
        "User already has an active subscription"
      );
    }

    // Get plan
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

interface IValidatePaymentRequest extends Request {
  body: {
    orderId: string;
    paymentId: string;
    signature: string;
  };
}

export const validatePayment = catchAsync(
  async (request: IValidatePaymentRequest, response: Response) => {
    Logger("validatePayment").info("");
    const {
      orderId: paymentGatewayOrderId,
      paymentId,
      signature,
    } = request.body;

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

    const order = await orderService.findAndUpdateOrder(
      {
        paymentGatewayOrderId,
        // status: OrderStatusEnum.Created, // TODO: uncomment this line
      },
      {
        paymentId,
        status: OrderStatusEnum.Paid,
      },
      "user plan"
    );

    if (!order) {
      return ApiResponse.NotFound(response, "Order not found");
    }

    const queueService = new SqsQueueService(queue);
    await queueService.enqueueMessage({
      queueUrl: process.env.AWS_SQS_URL as string,
      messageBody: JSON.stringify({ body: order }),
      messageGroupId: "onboard_user",
      messageDeduplicationId: order.id,
    });

    return ApiResponse.Ok(response, "Validation successful");
  }
);
