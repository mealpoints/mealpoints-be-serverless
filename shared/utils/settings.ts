import SettingsSingleton from "../config/settings";

export const getGlobalInstruction = async (): Promise<string> => {
  const settings = await SettingsSingleton.getInstance();
  const globalInstruction = settings.get(
    "openai.assistant.global-instruction"
  ) as string;
  return globalInstruction || "";
};
