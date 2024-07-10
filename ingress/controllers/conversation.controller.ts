import { Request, Response } from "express";
import logger from "../../shared/config/logger";
import * as conversationService from "../../shared/services/conversation.service";
import ApiResponse from "../../shared/utils/ApiResponse";
const Logger = logger("conversation.controller");

export const getConversation = async (request: Request, response: Response) => {
  const { id } = request.params;
  Logger("getConversation").debug("");

  const conversation = await conversationService.getConversation(id);
  if (!conversation) {
    return ApiResponse.NotFound(response, "Conversation not found");
  }

  return ApiResponse.Ok(response, conversation);
};

export const getConversationMessages = async (
  request: Request,
  response: Response
) => {
  const { id } = request.params;
  Logger("getConversationMessages").debug("");

  const conversationMessages =
    await conversationService.getConversationMessages(id);

  return ApiResponse.Ok(response, conversationMessages);
};
