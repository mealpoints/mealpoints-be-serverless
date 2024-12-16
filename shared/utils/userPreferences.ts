import logger from "../config/logger";
import { IUser } from "../models/user.model";
import { IUserPreferences } from "../models/userPreferences.model";
import { getUserPreferencesByUserId } from "../services/userPreferences.service";
const Logger = logger("shared/utils/userPreferences");

type DescriptionFunction<K extends keyof IUserPreferences> = (
  value: IUserPreferences[K]
) => string;

export const descriptivePreferenceFields: {
  [K in keyof Partial<IUserPreferences>]: DescriptionFunction<K>;
} = {
  birthYear: (value) => `They were born in ${value}.`,
  gender: (value) => `They identify as ${value}.`,
  height: (value) => `Their height is ${value?.value} ${value?.unit}.`,
  currentWeight: (value) =>
    `Their current weight is ${value?.value} ${value?.unit}.`,
  goalWeight: (value) => `Their goal weight is ${value?.value} ${value?.unit}.`,
  goal: (value) => `Their stated goal is: "${value}".`,
  medicalConditions: (value) =>
    `They have the following medical conditions: "${value}".`,
  exerciseRoutine: (value) => `Their exercise routine is: "${value}".`,
  sleepPatterns: (value) => `Their sleep patterns are: "${value}".`,
  stressLevels: (value) => `Their stress levels are: "${value}".`,
  familyHistory: (value) => `Their family history is: "${value}".`,
  occupation: (value) => `They are an ${value}.`,
  foodPreferences: (value) => `They prefer these foods: "${value}".`,
  excludedFoods: (value) => `They avoid these foods: "${value}".`,
  diet: (value) => `Their preferred diet is: "${value}".`,
};

export const userPreferencesInstruction = async (
  user: IUser
): Promise<string> => {
  Logger("userPreferencesInstruction").info("");
  try {
    const userPreferences = await getUserPreferencesByUserId(user.id);
    if (!userPreferences) {
      Logger("userPreferencesInstruction").info(
        "No preferences found for user."
      );
      return "";
    }

    return (
      Object.keys(descriptivePreferenceFields) as Array<
        keyof Partial<IUserPreferences>
      >
    )
      .filter((key) => {
        const value = userPreferences[key];
        return (
          value !== null &&
          value !== undefined &&
          (typeof value !== "object" ||
            (value.value !== null && value.value !== undefined))
        );
      })
      .map(<K extends keyof IUserPreferences>(key: K) => {
        const descriptionFunction = descriptivePreferenceFields[key];
        const value = userPreferences[key];

        return descriptionFunction ? descriptionFunction(value) : "";
      })
      .filter(Boolean)
      .join(" ");
  } catch (error) {
    Logger("userPreferencesInstruction").error(error);
    throw error;
  }
};
