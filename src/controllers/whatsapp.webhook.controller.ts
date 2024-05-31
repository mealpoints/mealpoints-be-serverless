import { processMessage } from "../lib/whatsapp";
import { IWhatsappWebhookPayload } from "../types/message";
import APIResponse from "../utils/APIResponse";
import { Request, Response } from "express";
import * as userService from "../services/user.service";
import { IUser } from "../models/user.model";

export const readMessage = async (req: Request, res: Response) => {
  try {
    console.debug(
      "whatsapp.webhook.controller: Reading message",
      JSON.stringify(req.body)
    );
    const webhookPayload = req.body as IWhatsappWebhookPayload;
    const contact =
      webhookPayload.entry[0].changes[0].value.metadata.display_phone_number;

    // Acknowledge message
    APIResponse.Ok(res, "Message read");

    // See if user with contact exists, if not create one
    let user = null;
    user = await userService.getUserByContact(contact);
    if (!user) {
      user = await userService.createUser({ contact });
    }

    // Process message
    processMessage(webhookPayload, user as IUser);
  } catch (error) {
    console.error("An error ocurred:", error);
  }
};
