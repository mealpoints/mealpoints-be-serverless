import { processMessage } from "../lib/whatsapp";
import { IWhatsappWebhookPayload } from "../types/message";
import APIResponse from "../utils/APIResponse";
import { Request, Response } from "express";

export const readMessage = async (req: Request, res: Response) => {
  try {
    console.debug(
      "whatsapp.webhook.controller: Reading message",
      JSON.stringify(req.body)
    );
    APIResponse.Ok(res, "Message read");

    processMessage(req.body as IWhatsappWebhookPayload);
  } catch (error) {
    console.error("An error ocurred:", error);
  }
};
