import axios, { AxiosInstance, AxiosResponse } from "axios";

const BASE_URL = process.env.WHATSAPP_API_BASE_URL;
const TOKEN = process.env.WHATSAPP_API_TOKEN;
const INSTANCE_ID = "your_instance_id"; // Replace with your instance ID if needed

interface MessageResponse {
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
  baseURL: process.env.WHATSAPP_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.WHATSAPP_API_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
});

/**
 * Send a message via WhatsApp Business API
 * @param {string} phoneNumber - The recipient's phone number
 * @param {string} message - The message to send
 * @returns {Promise<AxiosResponse>} - Axios response promise
 */
export const sendMessage = (
  phoneNumber: string,
  message: string
): Promise<AxiosResponse> => {
  console.debug(
    `[whatsapp.handler/sendMessage]: Sending message: ${message} to phoneNumber: ${phoneNumber}`
  );

  const data: MessageResponse = {
    messaging_product: "whatsapp",
    to: phoneNumber,
    type: "text",
    text: {
      body: message,
    },
  };

  return axiosInstance.post(
    `/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    data
  );
};
