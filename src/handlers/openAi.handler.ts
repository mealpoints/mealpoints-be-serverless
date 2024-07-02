// eslint-disable-next-line import/named
import OpenAI from "openai";
import { Run } from "openai/resources/beta/threads/runs/runs";
import { Thread } from "openai/resources/beta/threads/threads";
import logger from "../config/logger";
import { IUser } from "../models/user.model";
import { OpenAIMessageTypesEnum } from "../types/enums";
import { isValidUrl } from "../utils/url";
const Logger = logger("openai.handler");

const API_KEY = process.env.OPENAI_API_KEY as string;
const ASSITANT_ID = process.env.OPENAI_ASSISTANT_ID as string;

const openai = new OpenAI({
  apiKey: API_KEY,
});

interface IAskOptions {
  preExistingThreadId?: string;
  messageType?: OpenAIMessageTypesEnum;
  user: IUser;
}

export class OpenAIHandler {
  data: string;
  messageType?: OpenAIMessageTypesEnum;
  threadId: string;
  newThreadCreated: boolean = false;
  openaiResponse: string = "";
  user: IUser;
  thread?: Thread;
  run?: Run;

  constructor(data: string, options: IAskOptions) {
    this.data = data;
    this.threadId = options.preExistingThreadId || "";
    this.messageType = options.messageType;
    this.user = options.user;
  }

  private async createNewThread() {
    try {
      const thread = await openai.beta.threads.create();
      this.threadId = thread.id;
    } catch (error) {
      Logger("createNewThread").error(error);
      throw error;
    }
  }

  private async ensureThread() {
    if (this.threadId) {
      Logger("checkIfThreadExists").debug("Thread already exists, fecching it");
      this.thread = await openai.beta.threads.retrieve(this.threadId);
    } else {
      Logger("checkIfThreadExists").debug("Creating new thread");
      await this.createNewThread();
      this.newThreadCreated = true;
    }
  }

  private async createMessageWithText() {
    Logger("createMessageWithText").debug("Creating message with text content");
    try {
      await openai.beta.threads.messages.create(this.threadId, {
        role: "user",
        content: [
          {
            type: "text",
            text: this.data,
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

    if (!isValidUrl(this.data)) {
      throw new Error(`The image URL is not valid: ${this.data} `);
    }

    try {
      await openai.beta.threads.messages.create(this.threadId, {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: this.data,
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
    Logger("createStream").debug("");
    this.run = await openai.beta.threads.runs.create(this.threadId, {
      assistant_id: ASSITANT_ID,
    });
  }

  private async checkIfRunInProgress() {
    Logger("checkIfRunInProgress").debug("");
    return new Promise<void>((resolve, reject) => {
      try {
        const interval = setInterval(async () => {
          const run: Run = await openai.beta.threads.runs.retrieve(
            this.threadId,
            this.run?.id as string
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
      const messages = await openai.beta.threads.messages.list(this.threadId, {
        run_id: this.run?.id,
      });

      // Here we are assuming that the message type is going to be text as we are not handling images yet.
      // @ts-expect-error - We are assuming that the first message is going to be text.
      this.openaiResponse = messages.data[0].content[0].text.value;
    } catch (error) {
      Logger("getMessages").error(error);
      throw error;
    }
  }

  async ask(): Promise<{
    result: string;
    threadId: string;
    newThreadCreated: boolean;
  }> {
    try {
      await this.ensureThread();
      await this.createRun();
      await this.checkIfRunInProgress();
      await this.createMessage();
      await this.getMessages();
      return {
        result: this.openaiResponse,
        threadId: this.threadId,
        newThreadCreated: this.newThreadCreated,
      };
    } catch (error) {
      Logger("ask").error(error);
      throw error;
    }
  }
}
