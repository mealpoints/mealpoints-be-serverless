// eslint-disable-next-line import/named
import fs from "node:fs";
import OpenAI from "openai";
import logger from "../config/logger";
const Logger = logger("openAi.handler");

const API_KEY = process.env.OPENAI_API_KEY as string;

const openai = new OpenAI({
  apiKey: API_KEY,
});

export const generateChat = async (prompt: string) => {
  try {
    Logger("generateChat").info("");

    const gptResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });
    const message = gptResponse.choices[0].message.content as string;
    if (!message) {
      throw new Error("No message generated");
    }
    return message;
  } catch (error) {
    Logger("generateChat").error(error);
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
