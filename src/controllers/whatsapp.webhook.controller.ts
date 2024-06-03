import { processWebhook } from "../lib/whatsapp";
import { IWhatsappWebhookPayload } from "../types/message";
import APIResponse from "../utils/APIResponse";
import { Request, Response } from "express";

export const readMessage = async (req: Request, res: Response) => {
  try {
    console.debug(
      "[whatsapp.webhook.controller/readMessage]: Reading message",
      JSON.stringify(req.body)
    );
    APIResponse.Ok(res, "Message read");

    processWebhook(req.body as IWhatsappWebhookPayload);
  } catch (error) {
    console.error("[whatsapp.webhook.controller/readMessage]: Error:", error);
  }
};

export const verifyWebhook = async (req: Request, res: Response) => {
  try {
    console.debug(
      "[whatsapp.webhook.controller/verifyWebhook]: Verifying webhook",
      JSON.stringify(req.query)
    );
    return res.status(200).send(req.query["hub.challenge"]);
    // APIResponse.Ok(res, req.query["hub.challenge"]);
  } catch (error) {
    console.error("[whatsapp.webhook.controller/verifyWebhook]: Error:", error);
  }
};
