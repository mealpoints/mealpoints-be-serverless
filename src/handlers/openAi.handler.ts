// eslint-disable-next-line import/named
import axios, { AxiosInstance, AxiosResponse } from "axios";
import logger from "../config/logger";
const Logger = logger("openAi.handler");
const BASE_URL = "https://icanhazdadjoke.com";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const sendQuery = (): Promise<AxiosResponse> => {
  Logger("sendQuery").debug("");
  return axiosInstance.get(`/slack`);
};
