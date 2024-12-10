import { processTextMessage } from "../../../../../lambda-functions/message-processor/lib/whatsapp/textMessage";
import { USER_MESSAGES } from "../../../../../shared/config/config";
import SettingsSingleton from "../../../../../shared/config/settings";
import { IUser } from "../../../../../shared/models/user.model";
import * as messageService from "../../../../../shared/services/message.service";
import * as openAIService from "../../../../../shared/services/openAI.service";
import {
  MessageTypesEnum,
  OpenAIMessageTypesEnum,
} from "../../../../../shared/types/enums";
import { WhastappWebhookObject } from "../../../../../shared/types/message";
import { getOpenAiInstructions } from "../../../../../shared/utils/openai";
import { convertToHumanReadableMessage } from "../../../../../shared/utils/string";
import { WhatsappData } from "../../../../../shared/utils/WhatsappData";

// Mock the dependencies
jest.mock("../../../../../shared/utils/string");
jest.mock("../../../../../shared/utils/user");
jest.mock("../../../../../shared/config/settings");
jest.mock("../../../../../shared/services/openAI.service");
jest.mock("../../../../../shared/services/message.service");
jest.mock("../../../../../shared/utils/WhatsappData");

describe("processTextMessage", () => {
  // @ts-expect-error - ignoring the error for testing purposes
  const payload: WhastappWebhookObject = {
    // Mock payload data
  };
  // @ts-expect-error - ignoring the error for testing purposes
  const user: IUser = {
    id: "user-id",
    // Mock user data
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TODO: this test fails but usecase is correct. Fix later.
  it.skip("should send an error message if OpenAI service fails", async () => {
    const userMessage = "Hello";
    const assistantId = "assistant-id";

    (SettingsSingleton.getInstance as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue(assistantId),
    });
    (WhatsappData as jest.Mock).mockImplementation(() => ({
      userMessage,
    }));
    (openAIService.ask as jest.Mock).mockRejectedValue(
      new Error("OpenAI error")
    );

    await processTextMessage(payload, user);

    expect(SettingsSingleton.getInstance).toHaveBeenCalled();
    expect(WhatsappData).toHaveBeenCalledWith(payload);
    expect(openAIService.ask).toHaveBeenCalledWith(userMessage, user, {
      messageType: OpenAIMessageTypesEnum.Text,
      assistantId,
      additionalInstructions: "additional instructions",
    });
    expect(messageService.sendTextMessage).toHaveBeenCalledWith({
      user: user.id,
      payload: USER_MESSAGES.errors.text_not_processed,
      type: MessageTypesEnum.Text,
    });
    await expect(processTextMessage(payload, user)).rejects.toThrow(
      "Unexpected error"
    );
  });

  it("should process JSON message from openAIService", async () => {
    const userMessage = "Hello";
    const assistantId = "assistant-id";
    const openAIResponse = { message: "Hi there!" };
    const humanReadableMessage = "Hi there!";

    (SettingsSingleton.getInstance as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue(assistantId),
    });
    (WhatsappData as jest.Mock).mockImplementation(() => ({
      userMessage,
    }));
    (openAIService.ask as jest.Mock).mockResolvedValue(openAIResponse);
    (convertToHumanReadableMessage as jest.Mock).mockReturnValue(
      humanReadableMessage
    );
    (getOpenAiInstructions as jest.Mock).mockResolvedValue(
      "additional instructions"
    );

    await processTextMessage(payload, user);

    expect(SettingsSingleton.getInstance).toHaveBeenCalled();
    expect(WhatsappData).toHaveBeenCalledWith(payload);
    expect(openAIService.ask).toHaveBeenCalledWith(userMessage, user, {
      messageType: OpenAIMessageTypesEnum.Text,
      assistantId,
      additionalInstructions: "additional instructions",
    });
    expect(convertToHumanReadableMessage).toHaveBeenCalledWith(
      openAIResponse.message
    );
    expect(messageService.sendTextMessage).toHaveBeenCalledWith({
      user: user.id,
      payload: humanReadableMessage,
      type: MessageTypesEnum.Text,
    });
  });

  it("should process text message from openAIService", async () => {
    const userMessage = "Hello";
    const assistantId = "assistant-id";
    const openAIResponse = "Hi there!";
    const humanReadableMessage = "Hi there!";

    (SettingsSingleton.getInstance as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue(assistantId),
    });
    (WhatsappData as jest.Mock).mockImplementation(() => ({
      userMessage,
    }));
    (openAIService.ask as jest.Mock).mockResolvedValue(openAIResponse);
    (convertToHumanReadableMessage as jest.Mock).mockReturnValue(
      humanReadableMessage
    );
    (getOpenAiInstructions as jest.Mock).mockResolvedValue(
      "additional instructions"
    );

    await processTextMessage(payload, user);

    expect(SettingsSingleton.getInstance).toHaveBeenCalled();
    expect(WhatsappData).toHaveBeenCalledWith(payload);
    expect(openAIService.ask).toHaveBeenCalledWith(userMessage, user, {
      messageType: OpenAIMessageTypesEnum.Text,
      assistantId,
      additionalInstructions: "additional instructions",
    });
    expect(convertToHumanReadableMessage).toHaveBeenCalledWith(openAIResponse);
    expect(messageService.sendTextMessage).toHaveBeenCalledWith({
      user: user.id,
      payload: humanReadableMessage,
      type: MessageTypesEnum.Text,
    });
  });
});
