import { Request, Response } from "express";
import logger from "../config/logger";
import { processWebhook } from "../lib/whatsapp";
import { WebhookObject } from "../types/message";
import ApiResponse from "../utils/ApiResponse";
const Logger = logger("whatsapp.webhook.controller");

export const readMessage = async (request: Request, response: Response) => {
  try {
    Logger("readMessage").debug(JSON.stringify(request.body));
    await processWebhook(request.body as WebhookObject);
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
