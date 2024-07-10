import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { Request, Response } from "express";
import { QUEUE_MESSAGE_GROUP_IDS } from "../../../shared/config/config";
import logger from "../../../shared/config/logger";
import { queue } from "../../../shared/config/queue";
import { WebhookObject } from "../../../shared/types/message";
import ApiResponse from "../../../shared/utils/ApiResponse";
const Logger = logger("whatsapp.webhook.controller");

export const readMessage = async (request: Request, response: Response) => {
  try {
    Logger("readMessage").debug(JSON.stringify(request.body));

    const body: WebhookObject = request.body as WebhookObject;
    const whatsappMessageId: string = body.entry[0].changes[0].value
      .messages?.[0].id as string;
    const phoneNumberId: string =
      body.entry[0].changes[0].value.metadata.phone_number_id;

    // Only process messages from the WhatsApp number ID. This makes sure that we don't process messages from other environments.
    if (phoneNumberId === process.env.WHATSAPP_PHONE_NUMBER_ID) {
      const message = new SendMessageCommand({
        QueueUrl: process.env.AWS_SQS_URL as string,
        MessageBody: JSON.stringify({
          body,
        }),
        MessageGroupId: QUEUE_MESSAGE_GROUP_IDS.whatsapp_messages,
        MessageDeduplicationId: whatsappMessageId,
      });
      await queue.send(message);
    }
    return ApiResponse.Ok(response, "Message read");
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
