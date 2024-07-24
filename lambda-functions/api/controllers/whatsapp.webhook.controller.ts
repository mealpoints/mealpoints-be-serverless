import { Request, Response } from "express";
import { QUEUE_MESSAGE_GROUP_IDS } from "../../../shared/config/config";
import logger from "../../../shared/config/logger";
import { queue } from "../../../shared/config/queue";
import { SqsQueueService } from "../../../shared/services/queue.service";
import { WebhookObject } from "../../../shared/types/message";
import ApiResponse from "../../../shared/utils/ApiResponse";
import { WhatsappData } from "../../../shared/utils/WhatsappData";
import { catchAsync } from "../../../shared/utils/catchAsync";
const Logger = logger("whatsapp.webhook.controller");

const whatsappVerificationKey = process.env.WHATSAPP_VERIFICATION_KEY as string;

export const readMessage = catchAsync(
  async (request: Request, response: Response) => {
    Logger("readMessage").debug(JSON.stringify(request.body));

    const body: WebhookObject = request.body as WebhookObject;
    const whatsappData = new WhatsappData(body);

    const { whatsappMessageId } = whatsappData;
    if (!whatsappMessageId) {
      Logger("readMessage").error(
        "No WhatsApp message ID found in the webhook payload"
      );
      return ApiResponse.NoContent(response);
    }

    const queueService = new SqsQueueService(queue);
    await queueService.enqueueMessage({
      queueUrl: process.env.AWS_SQS_URL as string,
      messageBody: JSON.stringify({ body }),
      messageGroupId: QUEUE_MESSAGE_GROUP_IDS.whatsapp_messages,
      messageDeduplicationId: whatsappMessageId,
    });

    return ApiResponse.NoContent(response);
  }
);

export const verifyWebhook = catchAsync(
  (request: Request, response: Response) => {
    Logger("verifyWebhook").debug(JSON.stringify(request.body));
    const verificationToken = request.query["hub.verify_token"] as string;
    const hubChallenge = request.query["hub.challenge"] as string;

    if (verificationToken !== whatsappVerificationKey) {
      return ApiResponse.Forbidden(response, "Invalid verification token");
    }
    return ApiResponse.CustomResponse(response, 200, hubChallenge);
  }
);
