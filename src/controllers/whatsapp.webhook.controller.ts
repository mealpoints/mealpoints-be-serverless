import { Request, Response } from "express";
import { processWebhook } from "../lib/whatsapp";
import { WebhookObject } from "../types/message";
import ApiResponse from "../utils/ApiResponse";

export const readMessage = async (request: Request, response: Response) => {
  try {
    console.debug(
      "[whatsapp.webhook.controller/readMessage]: Reading message",
      JSON.stringify(request.body)
    );
    ApiResponse.Ok(response, "Message read");

    await processWebhook(request.body as WebhookObject);
    return;
  } catch (error) {
    console.error("[whatsapp.webhook.controller/readMessage]: Error:", error);
  }
};

export const verifyWebhook = (request: Request, response: Response) => {
  try {
    console.debug(
      "[whatsapp.webhook.controller/verifyWebhook]: Verifying webhook",
      JSON.stringify(request.query)
    );
    return response.status(200).send(request.query["hub.challenge"]);
  } catch (error) {
    console.error("[whatsapp.webhook.controller/verifyWebhook]: Error:", error);
  }
};
