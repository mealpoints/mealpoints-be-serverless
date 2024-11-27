// eslint-disable-next-line import/named
import OpenAI from "openai";
import { Run } from "openai/resources/beta/threads/runs/runs";
import { Thread } from "openai/resources/beta/threads/threads";
import logger from "../config/logger";
import SettingsSingleton from "../config/settings";
import { IOpenAIThread } from "../models/openAIThread.model";
import { OpenAIMessageTypesEnum } from "../types/enums";
import { isValidUrl } from "../utils/url";
import { MealData } from "../types/openai";
const Logger = logger("openai.handler");

const API_KEY = process.env.OPENAI_API_KEY as string;

const openai = new OpenAI({
  apiKey: API_KEY,
});

export class OpenAIHandler {
  result: string = "";
  thread!: Thread;
  run!: Run;
  prompt: string;
  openAIThread: IOpenAIThread | null;
  messageType: OpenAIMessageTypesEnum;
  assistantId: string;

  private _newThreadCreated: boolean = false;

  constructor({
    prompt,
    openAIThread,
    messageType,
    assistantId,
  }: {
    prompt: string;
    openAIThread: IOpenAIThread | null;
    messageType: OpenAIMessageTypesEnum;
    assistantId: string;
  }) {
    this.prompt = prompt;
    this.openAIThread = openAIThread;
    this.messageType = messageType;
    this.assistantId = assistantId;
  }

  private async initAsk() {
    await this.ensureThreadWithCurrentAssistant();
  }

  private async createNewThread() {
    Logger("createNewThread").info("Creating new thread");
    try {
      const thread = await openai.beta.threads.create();
      this.thread = thread;
      this._newThreadCreated = true;
    } catch (error) {
      Logger("createNewThread").error(error);
      throw error;
    }
  }

  private async ensureThreadWithCurrentAssistant() {
    // If there is no thread, create a new one.
    if (!this.openAIThread?.threadId) {
      Logger("checkIfThreadExists").info(
        "No thread exists, creating new thread"
      );
      await this.createNewThread();
      return;
    }

    // If the thread exists but the assistant is different, create a new thread.
    if (this.openAIThread?.assistantId !== this.assistantId) {
      Logger("checkIfThreadExists").info(
        "Thread with the same assistant does not exist, creating new thread"
      );
      await this.createNewThread();
      return;
    }

    // If the thread exists with the same assistant, fetch the thread.
    Logger("checkIfThreadExists").info(
      "Thread with the same assistant already exists, fetching it"
    );
    this.thread = await openai.beta.threads.retrieve(
      this.openAIThread?.threadId
    );
  }

  private async createMessageWithText() {
    Logger("createMessageWithText").info("Creating message with text content");
    try {
      await openai.beta.threads.messages.create(this.thread.id, {
        role: "user",
        content: [
          {
            type: "text",
            text: this.prompt,
          },
        ],
      });
    } catch (error) {
      Logger("createMessageWithText").error(error);
      throw error;
    }
  }

  private async createMessageWithImage() {
    Logger("createMessageWithImage").info(
      "Creating message with image content"
    );

    if (!isValidUrl(this.prompt)) {
      throw new Error(`The image URL is not valid: ${this.prompt} `);
    }

    try {
      await openai.beta.threads.messages.create(this.thread.id, {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: this.prompt,
              detail: "low",
            },
          },
        ],
      });
    } catch (error) {
      Logger("createMessageWithImage").error(error);
      throw error;
    }
  }

  private async createMessage() {
    switch (this.messageType) {
      case OpenAIMessageTypesEnum.Text: {
        await this.createMessageWithText();
        break;
      }
      case OpenAIMessageTypesEnum.Image: {
        await this.createMessageWithImage();
        break;
      }
      default: {
        Logger("ask").error(
          `The message type ${this.messageType} is not supported.`
        );
        break;
      }
    }
  }

  private async createRun() {
    Logger("createRun").info("");
    try {
      this.run = await openai.beta.threads.runs.create(this.thread.id, {
        assistant_id: this.assistantId,
      });
    } catch (error) {
      Logger("createRun").error(error);
      throw error;
    }
  }

  private async checkIfRunInProgress() {
    Logger("checkIfRunInProgress").info("");
    return new Promise<void>((resolve, reject) => {
      try {
        const interval = setInterval(async () => {
          const run: Run = await openai.beta.threads.runs.retrieve(
            this.thread.id,
            this.run.id
          );
          Logger("checkIfRunInProgress").info(`Run status: ${run.status}`);
          if (run.status === "failed") {
            clearInterval(interval);
            reject(
              new Error(
                "Run failed with error: " + JSON.stringify(run.last_error) ||
                  "Unknown error"
              )
            );
          }

          if (run.status === "completed") {
            clearInterval(interval);
            resolve();
          }
        }, 1000);
      } catch (error) {
        Logger("checkIfRunInProgress").error(error);
        reject(error);
      }
    });
  }

  private async getMessages() {
    Logger("getMessages").info("");
    try {
      const messages = await openai.beta.threads.messages.list(this.thread.id, {
        run_id: this.run.id,
        order: "desc",
        limit: 1,
      });

      // Here we are assuming that the message type is going to be text as we are not handling images yet.
      // @ts-expect-error - We are assuming that the first message is going to be text.
      this.result = messages.data[0].content[0].text.value;
    } catch (error) {
      Logger("getMessages").error(error);
      throw error;
    }
  }

  get threadId(): string {
    return this.thread.id;
  }

  get newThreadCreated(): boolean {
    return this._newThreadCreated;
  }

  private async askOnce(): Promise<string> {
    try {
      await this.createMessage();
      await this.createRun();
      await this.checkIfRunInProgress();
      await this.getMessages();
      return this.result;
    } catch (error) {
      Logger("askOnce").error(error);
      throw error;
    }
  }

  // @ts-expect-error - We are not going to return anything from the catch block.
  async ask(): Promise<string> {
    // Get Settings
    const settings = await SettingsSingleton.getInstance();
    const maxRunsOnAThread: number = settings.get(
      "open-ai.max-runs-on-a-thread"
    ) as number;
    const maxRetries = settings.get("open-ai.max-retries") as number;

    let threadRun: number = 0;
    let retryCount: number = 0;
    await this.initAsk();

    while (threadRun < maxRunsOnAThread) {
      try {
        const result = await this.askOnce();
        return result;
      } catch (error) {
        threadRun++;
        Logger("ask").error(
          `Thread run ${threadRun}/${maxRunsOnAThread} failed: ${JSON.stringify(
            error
          )}`
        );
        if (threadRun >= maxRunsOnAThread) {
          retryCount++;
          if (retryCount < maxRetries) {
            Logger("ask").info(
              `Creating new thread after ${retryCount}/${maxRetries} retries.`
            );
            await this.createNewThread();
            threadRun = 0; // Reset attempt counter
          } else {
            Logger("ask").error(
              "All retry attempts failed after creating a new thread."
            );
            throw error;
          }
        }
      }
    }
  }
}
