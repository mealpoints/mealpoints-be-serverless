// eslint-disable-next-line import/named
import fs from "node:fs";
import OpenAI from "openai";
import logger from "../config/logger";
import { OpenAIMessageTypesEnum } from "../types/enums";
const Logger = logger("openai.handler");

const API_KEY = process.env.OPENAI_API_KEY as string;
const ASSITANT_ID = process.env.OPENAI_ASSISTANT_ID as string;

const openai = new OpenAI({
  apiKey: API_KEY,
});

interface IAskOptions {
  preExistingThreadId?: string;
  messageType?: OpenAIMessageTypesEnum;
}

export const ask = async (question: string, options: IAskOptions) => {
  try {
    const { preExistingThreadId, messageType } = options;
    Logger("ask").debug("");

    let openaiThreadId: string = preExistingThreadId || "";
    let newThreadCreated = false;

    if (!preExistingThreadId) {
      Logger("ask").debug("Creating new thread");
      const thread = await openai.beta.threads.create();
      openaiThreadId = thread.id;
      newThreadCreated = true;
    }
    let result: string = "";

    if (messageType === OpenAIMessageTypesEnum.Text) {
      await openai.beta.threads.messages.create(openaiThreadId, {
        role: "user",
        content: question,
      });
    } else if (messageType === OpenAIMessageTypesEnum.Image) {
      Logger("ask").debug(question);
      await openai.beta.threads.messages.create(openaiThreadId, {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: question,
              detail: "low",
            },
          },
        ],
      });
    }

    return new Promise<{
      result: string;
      threadId: string;
      newThreadCreated: boolean;
    }>((resolve) => {
      openai.beta.threads.runs
        .stream(openaiThreadId, {
          assistant_id: ASSITANT_ID,
        })
        .on("textDelta", (textDelta) => {
          const string_ = textDelta.value || "";
          if (string_) {
            result += textDelta.value;
          }
        })
        .on("textDone", () => {
          resolve({ result, threadId: openaiThreadId, newThreadCreated });
        });
    });
  } catch (error) {
    Logger("ask").error(error);
    throw error;
  }
};

export const uploadImage = async (filePath: string) => {
  try {
    Logger("uploadImage").info("");
    const image = fs.readFileSync(filePath, { encoding: "base64" });

    const gptResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Tell what you see in the image: data:image/png;base64,${image}`,
        },
      ],
    });

    const message = gptResponse.choices[0].message.content as string;
    if (!message) {
      throw new Error("No message generated");
    }
    return message;
  } catch (error) {
    Logger("uploadImage").error(error);
    throw error;
  }
};
