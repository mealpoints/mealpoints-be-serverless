import { Request, Response } from "express";
import logger from "../config/logger";
import ApiResponse from "../utils/ApiResponse";

const Logger = logger("middleware/notFound");

export const notFoundHandler = (request: Request, response: Response) => {
  Logger("notFoundHandler").error(request.url);
  return ApiResponse.NotFound(response);
};
