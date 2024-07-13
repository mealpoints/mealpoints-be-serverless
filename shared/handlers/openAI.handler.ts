// eslint-disable-next-line import/named
import OpenAI from "openai";
import { Run } from "openai/resources/beta/threads/runs/runs";
import { Thread } from "openai/resources/beta/threads/threads";
import { OPEN_AI } from "../config/config";
import logger from "../config/logger";
import { IConversation } from "../models/conversation.model";
import { OpenAIMessageTypesEnum } from "../types/enums";
import { isValidUrl } from "../utils/url";
const Logger = logger("openai.handler");

const API_KEY = process.env.OPENAI_API_KEY as string;
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID as string;

const openai = new OpenAI({
  apiKey: API_KEY,
});

export class OpenAIHandler {
  result: string = "";
  thread!: Thread;
  run!: Run;

  private _newThreadCreated: boolean = false;
  private _assistantId: string;

  constructor(
    private prompt: string,
    private conversation: IConversation,
    private messageType: OpenAIMessageTypesEnum
  ) {
    this._assistantId = ASSISTANT_ID;
  }

  private async createNewThread() {
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
    const threadId = this.conversation.openaiThreadId;
    const assistantId = this.conversation.openaiAssistantId;

    // If there is no thread, create a new one.
    if (!threadId) {
      Logger("checkIfThreadExists").debug(
        "No thread exists, creating new thread"
      );
      await this.createNewThread();
      return;
    }

    // If the thread exists but the assistant is different, create a new thread.
    if (assistantId !== ASSISTANT_ID) {
      Logger("checkIfThreadExists").debug(
        "Thread with the same assistant does not exist, creating new thread"
      );
      await this.createNewThread();
      return;
    }

    // If the thread exists with the same assistant, fetch the thread.
    Logger("checkIfThreadExists").debug(
      "Thread with the same assistant already exists, fetching it"
    );
    this.thread = await openai.beta.threads.retrieve(threadId);
  }

  private async createMessageWithText() {
    Logger("createMessageWithText").debug("Creating message with text content");
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
    Logger("createMessageWithImage").debug(
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
    Logger("createRun").debug("");
    try {
      this.run = await openai.beta.threads.runs.create(this.thread.id, {
        assistant_id: ASSISTANT_ID,
      });
    } catch (error) {
      Logger("createRun").error(error);
      throw error;
    }
  }

  private async checkIfRunInProgress() {
    Logger("checkIfRunInProgress").debug("");
    return new Promise<void>((resolve, reject) => {
      try {
        const interval = setInterval(async () => {
          const run: Run = await openai.beta.threads.runs.retrieve(
            this.thread.id,
            this.run.id
          );
          Logger("checkIfRunInProgress").debug(`Run status: ${run.status}`);
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
    Logger("getMessages").debug("");
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

  get assistantId(): string {
    return this._assistantId;
  }

  get newThreadCreated(): boolean {
    return this._newThreadCreated;
  }

  async askOnce(): Promise<string> {
    try {
      await this.ensureThreadWithCurrentAssistant();
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
    const maxRunsOnAThread: number = OPEN_AI.max_runs_on_a_thread;
    const maxRetries = OPEN_AI.max_retries;
    let threadRun: number = 0;
    let retryCount: number = 0;

    while (threadRun < maxRunsOnAThread) {
      try {
        return await this.askOnce();
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
