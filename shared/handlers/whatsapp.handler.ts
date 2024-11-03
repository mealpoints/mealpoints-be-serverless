/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
// eslint-disable-next-line import/named
import axios, { AxiosInstance, AxiosResponse } from "axios";
import * as fs from "node:fs";
import * as path from "node:path";
import logger from "../config/logger";
import { ComponentTypesEnum } from "../types/enums";
import {
  InteractiveMessageBodyOptions,
  InteractiveMessageRequestBody,
  ITemplateMessageRequestBody,
  MessageTemplateObject,
} from "../types/message";
const Logger = logger("whatsapp.handler");

const BASE_URL = process.env.WHATSAPP_API_BASE_URL;
const TOKEN = process.env.WHATSAPP_API_ACCESS_TOKEN;
const INSTANCE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

interface ITextMessageRequestBody {
  messaging_product: string;
  to: string;
  type: string;
  text?: {
    body: string;
  };
  image?: {
    link: string;
    caption?: string;
  };
  video?: {
    link: string;
    caption?: string;
  };
  document?: {
    link: string;
    caption?: string;
  };
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
});

/**
 * Send a message via WhatsApp Business API
 * @param {string} phoneNumber - The recipient's phone number
 * @param {string} message - The message to send
 * @returns {Promise<AxiosResponse>} - Axios response promise
 */
export const sendMessage = async (
  phoneNumber: string,
  message: string
): Promise<AxiosResponse> => {
  Logger("sendMessage").info("");

  const data: ITextMessageRequestBody = {
    messaging_product: "whatsapp",
    to: phoneNumber,
    type: "text",
    text: {
      body: message,
    },
  };

  return await axiosInstance.post(`/${INSTANCE_ID}/messages`, data);
};

export const sendInteractiveMessage = async (
  phoneNumber: string,
  data: InteractiveMessageBodyOptions
): Promise<AxiosResponse> => {
  Logger("sendInteractiveMessage").info("");

  const body: InteractiveMessageRequestBody = {
    recipient_type: "individual",
    messaging_product: "whatsapp",
    to: phoneNumber,
    type: "interactive",
    interactive: {
      type: "cta_url",
      action: {
        name: "cta_url",
        parameters: {
          display_text: data.action.displayText,
          url: data.action.url,
        },
      },
    },
  };

  if (data.header) {
    body.interactive.header = {
      type: "text",
      text: data.header,
    };
  }

  if (data.body) {
    body.interactive.body = {
      text: data.body,
    };
  }

  if (data.footer) {
    body.interactive.footer = {
      text: data.footer,
    };
  }

  return await axiosInstance.post(`/${INSTANCE_ID}/messages`, body);
};

const downloadImage = async (
  imageUrl: string,
  imageId: string
): Promise<string> => {
  Logger("downloadImage").info("");
  try {
    const response = await axiosInstance.get(imageUrl, {
      responseType: "stream",
    });
    return new Promise((resolve, reject) => {
      const filePath = path.join(`/tmp/${imageId}.jpg`);
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);
      writer.on("finish", () => {
        Logger("downloadImage").info(`Image downloaded successfully`);
        resolve(filePath);
      });
      writer.on("error", (error) => {
        Logger("downloadImage").error(error);
        reject(error);
      });
    });
  } catch (error) {
    Logger("downloadImage").error(error);
    throw error;
  }
};

export const getImageSentViaMessage = async (imageId: string) => {
  Logger("getImageSentViaMessage").info(imageId);
  try {
    const response = await axiosInstance.get(`/${imageId}`);

    Logger("getImageSentViaMessage").info("");
    const filePath = await downloadImage(response.data.url, imageId);
    return filePath;
  } catch (error) {
    Logger("getImageSentViaMessage").error(error);
    throw error;
  }
};

export const sendTemplateMessage = async (
  phoneNumber: string,
  template: MessageTemplateObject<ComponentTypesEnum>
): Promise<AxiosResponse> => {
  Logger("sendTemplateMessage").info("");

  const data: ITemplateMessageRequestBody = {
    messaging_product: "whatsapp",
    to: phoneNumber,
    type: "template",
    template,
  };

  try {
    return await axiosInstance.post(`/${INSTANCE_ID}/messages`, data);
  } catch (error) {
    Logger("sendTemplateMessage").error(error);
    console.log(error);

    throw error;
  }
};
