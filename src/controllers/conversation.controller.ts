import { Request, Response } from "express";
import * as conversationService from "../services/conversation.service";
import ApiResponse from "../utils/ApiResponse";

export const getConversation = async (request: Request, response: Response) => {
  const { id } = request.params;
  console.debug("[conversation.controller/getConversation]");

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
  console.debug("[conversation.controller/getConversationMessages]");

  const conversationMessages =
    await conversationService.getConversationMessages(id);

  return ApiResponse.Ok(response, conversationMessages);
};
