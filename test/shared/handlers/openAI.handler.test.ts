import OpenAI from "openai";
import { OpenAIHandler } from "../../../shared/handlers/openAI.handler";
import { IConversation } from "../../../shared/models/conversation.model";
import { OpenAIMessageTypesEnum } from "../../../shared/types/enums";

// Mock the OpenAI module
jest.mock("openai");
const MockOpenAI = OpenAI as jest.Mocked<typeof OpenAI>;

const mockCreateThread = jest.fn();
const mockRetrieveThread = jest.fn();
const mockCreateMessage = jest.fn();
const mockCreateRun = jest.fn();
const mockRetrieveRun = jest.fn();
const mockListMessages = jest.fn();
const mockCheckIfRunInProgress = jest.fn();

MockOpenAI.prototype.beta = {
  threads: {
    create: mockCreateThread,
    retrieve: mockRetrieveThread,
    // @ts-expect-error - We will not be covering all methods
    messages: {
      create: mockCreateMessage,
      list: mockListMessages,
    },
    // @ts-expect-error - We will not be covering all methods
    runs: {
      create: mockCreateRun,
      retrieve: mockRetrieveRun,
    },
  },
};

describe("OpenAIHandler", () => {
  const API_KEY = "fake-api-key";
  const ASSISTANT_ID = "fake-assistant-id";
  const prompt = "Hello, OpenAI";
  // @ts-expect-error - We will not be covering all properties
  const conversation: IConversation = {
    openaiThreadId: "",
    openaiAssistantId: "",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.OPENAI_API_KEY = API_KEY;
    process.env.OPENAI_ASSISTANT_ID = ASSISTANT_ID;
    MockOpenAI.prototype.beta = {
      threads: {
        create: mockCreateThread,
        retrieve: mockRetrieveThread,
        // @ts-expect-error - We will not be covering all methods
        messages: {
          create: mockCreateMessage,
          list: mockListMessages,
        },
        // @ts-expect-error - We will not be covering all methods
        runs: {
          create: mockCreateRun,
          retrieve: mockRetrieveRun,
        },
      },
    };
  });

  it("should create a new instance with correct properties", () => {
    const handler = new OpenAIHandler(
      prompt,
      conversation,
      OpenAIMessageTypesEnum.Text,
      ASSISTANT_ID
    );
    expect(handler).toBeInstanceOf(OpenAIHandler);
    expect(handler["prompt"]).toBe(prompt);
    expect(handler["conversation"]).toBe(conversation);
    expect(handler["messageType"]).toBe(OpenAIMessageTypesEnum.Text);
  });

  it("should return newThreadCreated as false by default", () => {
    const handler = new OpenAIHandler(
      prompt,
      conversation,
      OpenAIMessageTypesEnum.Text,
      ASSISTANT_ID
    );
    expect(handler).toBeInstanceOf(OpenAIHandler);
    expect(handler.newThreadCreated).toBe(false);
  });

  it.only("should return newThreadCreated as true when threadId does not exist by default", async () => {
    const handler = new OpenAIHandler(
      prompt,
      // @ts-expect-error - We are not passing the properties on purpose
      {},
      OpenAIMessageTypesEnum.Text,
      ASSISTANT_ID
    );
    mockCreateThread.mockResolvedValue({ id: "new-thread-id" });
    mockCheckIfRunInProgress.mockResolvedValue(() => Promise.resolve());
    mockRetrieveRun.mockResolvedValue({ id: "run-id", status: "completed" });
    expect(handler).toBeInstanceOf(OpenAIHandler);
    await handler.ask();
    expect(handler.newThreadCreated).toBe(true);
  });

  it("should create a new thread if no thread exists", async () => {
    const handler = new OpenAIHandler(
      prompt,
      conversation,
      OpenAIMessageTypesEnum.Text,
      ASSISTANT_ID
    );
    mockCreateThread.mockResolvedValue({ id: "new-thread-id" });

    await handler["ensureThreadWithCurrentAssistant"]();
    expect(mockCreateThread).toHaveBeenCalledTimes(1);
    expect(handler.thread.id).toBe("new-thread-id");
  });

  it("should fetch the existing thread if it exists with the same assistant", async () => {
    conversation.openaiThreadId = "existing-thread-id";
    conversation.openaiAssistantId = ASSISTANT_ID;
    const handler = new OpenAIHandler(
      prompt,
      conversation,
      OpenAIMessageTypesEnum.Text,
      ASSISTANT_ID
    );
    mockRetrieveThread.mockResolvedValue({ id: "existing-thread-id" });

    await handler["ensureThreadWithCurrentAssistant"]();
    expect(mockRetrieveThread).toHaveBeenCalledTimes(1);
    expect(handler.thread.id).toBe("existing-thread-id");
  });

  it("should create a new message with text content", async () => {
    conversation.openaiThreadId = "existing-thread-id";
    const handler = new OpenAIHandler(
      prompt,
      conversation,
      OpenAIMessageTypesEnum.Text,
      ASSISTANT_ID
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler.thread = { id: "existing-thread-id" } as any;

    await handler["createMessageWithText"]();
    expect(mockCreateMessage).toHaveBeenCalledWith("existing-thread-id", {
      role: "user",
      content: [
        {
          type: "text",
          text: prompt,
        },
      ],
    });
  });

  it("should create a new message with image content if URL is valid", async () => {
    const validImageUrl = "https://example.com/image.jpg";
    const handler = new OpenAIHandler(
      validImageUrl,
      conversation,
      OpenAIMessageTypesEnum.Image,
      ASSISTANT_ID
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler.thread = { id: "existing-thread-id" } as any;

    await handler["createMessageWithImage"]();
    expect(mockCreateMessage).toHaveBeenCalledWith("existing-thread-id", {
      role: "user",
      content: [
        {
          type: "image_url",
          image_url: {
            url: validImageUrl,
            detail: "low",
          },
        },
      ],
    });
  });

  it("should throw an error if image URL is not valid", async () => {
    const invalidImageUrl = "invalid-url";
    const handler = new OpenAIHandler(
      invalidImageUrl,
      conversation,
      OpenAIMessageTypesEnum.Image,
      ASSISTANT_ID
    );

    await expect(handler["createMessageWithImage"]()).rejects.toThrow(
      `The image URL is not valid: ${invalidImageUrl}`
    );
  });

  it("should handle askOnce method correctly", async () => {
    const handler = new OpenAIHandler(
      prompt,
      conversation,
      OpenAIMessageTypesEnum.Text,
      ASSISTANT_ID
    );
    mockCreateThread.mockResolvedValue({ id: "new-thread-id" });
    mockCreateMessage.mockResolvedValue({});
    mockCreateRun.mockResolvedValue({ id: "run-id" });
    mockRetrieveRun.mockResolvedValue({ id: "run-id", status: "completed" });
    mockListMessages.mockResolvedValue({
      data: [{ content: [{ text: { value: "response text" } }] }],
    });

    const result = await handler.askOnce();
    expect(result).toBe("response text");
  });

  it("should retry on failure in ask method", async () => {
    const handler = new OpenAIHandler(
      prompt,
      conversation,
      OpenAIMessageTypesEnum.Text,
      ASSISTANT_ID
    );
    mockCreateThread.mockResolvedValue({ id: "new-thread-id" });
    mockCreateMessage.mockRejectedValueOnce(
      new Error("Message creation failed")
    );
    mockCreateMessage.mockResolvedValue({});
    mockCreateRun.mockResolvedValue({ id: "run-id" });
    mockRetrieveRun.mockResolvedValue({ id: "run-id", status: "completed" });
    mockListMessages.mockResolvedValue({
      data: [{ content: [{ text: { value: "response text" } }] }],
    });

    const result = await handler.ask();
    expect(result).toBe("response text");
  });

  // Add more tests as necessary for other methods and scenarios
});
