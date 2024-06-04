// eslint-disable-next-line import/named
import axios, { AxiosInstance, AxiosResponse } from "axios";

const BASE_URL = "https://icanhazdadjoke.com";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const sendQuery = (): Promise<AxiosResponse> => {
  console.debug(`[openai.handler/sendQuery]`);
  return axiosInstance.get(`/slack`);
};
