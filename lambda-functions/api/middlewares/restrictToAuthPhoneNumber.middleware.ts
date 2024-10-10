import { NextFunction, Request, Response } from "express";
import logger from "../../../shared/config/logger";
import { WebhookObject } from "../../../shared/types/message";
import ApiResponse from "../../../shared/utils/ApiResponse";
import { WhatsappData } from "../../../shared/utils/WhatsappData";

const Logger = logger("restrictToAuthPhoneNumber.middleware");

const whatsappPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID as string;
export const restrictToAuthPhoneNumbers = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const body: WebhookObject = request.body as WebhookObject;
  const whatsappData = new WhatsappData(body);

  // Only process messages from the WhatsApp number ID.
  // This makes sure that we don't process messages from other environments.
  if (!whatsappData.isMessageFromWatsappPhoneNumberId(whatsappPhoneNumberId)) {
    Logger("restrictToAuthPhoneNumbers").info(
      "Message is not from the authenthorized WhatsApp phone number"
    );
    return ApiResponse.Ok(response);
  }

  next();
};
