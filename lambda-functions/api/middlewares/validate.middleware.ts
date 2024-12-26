import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";
import ApiResponse from "../../../shared/utils/ApiResponse";

export const validate =
  (schema: ZodSchema) =>
  (request: Request, response: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: request.body,
        query: request.query,
        params: request.params,
      });
      next(); // Proceed if validation passes
    } catch (error) {
      return ApiResponse.BadRequest(response, (error as ZodError).errors);
    }
  };
