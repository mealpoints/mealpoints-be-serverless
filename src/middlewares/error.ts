/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import logger from "../config/logger";
import ApiResponse from "../utils/ApiResponse";

const Logger = logger("middleware/error");

export const errorHandler = (
  error: any,
  request: Request,
  response: Response
) => {
  Logger("errorHandler").error(error);
  return ApiResponse.ServerError(response, error);
};
