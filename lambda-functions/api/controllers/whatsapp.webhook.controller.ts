import { Request, Response } from "express";
import { QUEUE_MESSAGE_GROUP_IDS } from "../../../shared/config/config";
import logger from "../../../shared/config/logger";
import { queue } from "../../../shared/config/queue";
import { SqsQueueService } from "../../../shared/services/queue.service";
import { WebhookObject } from "../../../shared/types/message";
import ApiResponse from "../../../shared/utils/ApiResponse";
import { getWhatsappMessageId } from "../utils/whatsapp";
const Logger = logger("whatsapp.webhook.controller");

export const readMessage = async (request: Request, response: Response) => {
  try {
    Logger("readMessage").debug(JSON.stringify(request.body));

    const body: WebhookObject = request.body as WebhookObject;
    const whatsappMessageId: string | undefined = getWhatsappMessageId(body);
    const phoneNumberId: string =
      body.entry[0].changes[0].value.metadata.phone_number_id;

    if (!whatsappMessageId) {
      Logger("readMessage").error(
        "No WhatsApp message ID found in the webhook payload"
      );
      return ApiResponse.Ok(response);
    }

    // Only process messages from the WhatsApp number ID. This makes sure that we don't process messages from other environments.
    if (phoneNumberId === process.env.WHATSAPP_PHONE_NUMBER_ID) {
      const queueService = new SqsQueueService(queue);
      await queueService.enqueueMessage({
        queueUrl: process.env.AWS_SQS_URL as string,
        messageBody: JSON.stringify({ body }),
        messageGroupId: QUEUE_MESSAGE_GROUP_IDS.whatsapp_messages,
        messageDeduplicationId: whatsappMessageId,
      });
    }
    return ApiResponse.Ok(response);
  } catch (error) {
    Logger("readMessage").error(error);
    return ApiResponse.ServerError(response, error);
  }
};

export const verifyWebhook = (request: Request, response: Response) => {
  try {
    Logger("verifyWebhook").debug(JSON.stringify(request.body));

    if (
      request.query["hub.verify_token"] ===
      process.env.WHATSAPP_VERIFICATION_KEY
    ) {
      return response.status(200).send(request.query["hub.challenge"]);
    }

    return response.status(403).send("Invalid verify token");
  } catch (error) {
    Logger("verifyWebhook").error(error);
  }
};
