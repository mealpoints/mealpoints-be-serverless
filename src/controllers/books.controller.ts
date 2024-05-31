import { Request, Response } from "express";
import ApiResponse from "../utils/APIResponse";
import * as messageService from "../services/message.service";

export const getBooks = async (req: Request, res: Response) => {
  try {
    console.debug("books.controller: Gettiing messages");
    const books = await messageService.getMessages();
    return ApiResponse.Ok(res, books);
  } catch (error) {
    console.error("An error ocurred:", error);
    return ApiResponse.ServerError(res, error);
  }
};

export const createMessage = async (req: Request, res: Response) => {
  try {
    console.debug("books.controller: Creating message");
    const message = await messageService.createMessage(req.body);
    return ApiResponse.Ok(res, message);
  } catch (error) {
    console.error("An error ocurred:", error);
    return ApiResponse.ServerError(res, error);
  }
};
