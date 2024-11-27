import { OpenAIResponse, OpenAIResponseObject } from "../types/openai";

export function isOpenAIResponseObject(response: OpenAIResponse): response is OpenAIResponseObject {
    return typeof response === "object" && response !== null && "message" in response;
}
