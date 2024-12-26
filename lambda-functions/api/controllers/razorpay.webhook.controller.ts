import { Request, Response } from "express";
import logger from "../../../shared/config/logger";
import ApiResponse from "../../../shared/utils/ApiResponse";

const Logger = logger("razorpay.webhook.controller");

export const readData = async (request: Request, response: Response) => {
  Logger("readData").info("");
  return ApiResponse.Ok(response);
};
