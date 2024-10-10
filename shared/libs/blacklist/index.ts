import SettingsSingleton from "../../config/settings";

export const isContactBlacklisted = async (
  contact: string
): Promise<boolean> => {
  const settings = await SettingsSingleton.getInstance();
  const blacklist = settings.get("blacklist") as string[];
  if (blacklist && blacklist.includes(contact)) {
    return true;
  }
  return false;
};
