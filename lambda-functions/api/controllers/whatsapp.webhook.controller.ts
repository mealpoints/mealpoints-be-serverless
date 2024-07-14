import { Request, Response } from "express";
import { QUEUE_MESSAGE_GROUP_IDS } from "../../../shared/config/config";
import logger from "../../../shared/config/logger";
import { queue } from "../../../shared/config/queue";
import { SqsQueueService } from "../../../shared/services/queue.service";
import { WebhookObject } from "../../../shared/types/message";
import ApiResponse from "../../../shared/utils/ApiResponse";
import { WhatsappData } from "../../../shared/utils/WhatsappData";
const Logger = logger("whatsapp.webhook.controller");

const whatsappVerificationKey = process.env.WHATSAPP_VERIFICATION_KEY as string;

export const readMessage = async (request: Request, response: Response) => {
  try {
    Logger("readMessage").debug(JSON.stringify(request.body));

    const body: WebhookObject = request.body as WebhookObject;
    const whatsappData = new WhatsappData(body);

    const { whatsappMessageId } = whatsappData;
    if (!whatsappMessageId) {
      Logger("readMessage").error(
        "No WhatsApp message ID found in the webhook payload"
      );
      return ApiResponse.Ok(response);
    }

    const queueService = new SqsQueueService(queue);
    await queueService.enqueueMessage({
      queueUrl: process.env.AWS_SQS_URL as string,
      messageBody: JSON.stringify({ body }),
      messageGroupId: QUEUE_MESSAGE_GROUP_IDS.whatsapp_messages,
      messageDeduplicationId: whatsappMessageId,
    });

    return ApiResponse.Ok(response);
  } catch (error) {
    Logger("readMessage").error(error);
    return ApiResponse.ServerError(response, error);
  }
};

export const verifyWebhook = (request: Request, response: Response) => {
  try {
    Logger("verifyWebhook").debug(JSON.stringify(request.body));

    if (request.query["hub.verify_token"] !== whatsappVerificationKey) {
      return response.status(403).send("Invalid verify token");
    }

    return response.status(200).send(request.query["hub.challenge"]);
  } catch (error) {
    Logger("verifyWebhook").error(error);
  }
};
