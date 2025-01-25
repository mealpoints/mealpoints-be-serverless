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
  birthDate: (value) => `Their birthdate is ${value?.toLocaleDateString()}.`,
  gender: (value) => `They identify as ${value}.`,
  height: (value) => `Their height is ${value?.value} ${value?.unit}.`,
  currentWeight: (value) =>
    `Their current weight is ${value?.value} ${value?.unit}.`,
  goalWeight: (value) => `Their goal weight is ${value?.value} ${value?.unit}.`,
  goal: (value) => `Their stated goal is: "${value}".`,
  physicalActivity: (value) => `Their physical activity level is ${value}.`,
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
  language: (value) =>
    `Their language preference of this conversation is ${value}. Hence Reply in ${value} language.`,
};

const generateDescriptionIfValid = <K extends keyof IUserPreferences>(
  preferenceKey: K,
  preferenceValue: IUserPreferences[K]
): string | undefined => {
  const descriptionFunction = descriptivePreferenceFields[preferenceKey];
  if (
    descriptionFunction &&
    preferenceValue !== null &&
    preferenceValue !== undefined &&
    (typeof preferenceValue !== "object" ||
      (preferenceValue.value !== null && preferenceValue.value !== undefined))
  ) {
    return descriptionFunction(preferenceValue);
  }
  return undefined; // Skip invalid keys
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

    // Loop over userPreferences to getDescriptionString of its values if Valid
    const descriptions = Object.entries(userPreferences)
      .map(([preferenceKey, preferenceValue]) =>
        generateDescriptionIfValid(
          preferenceKey as keyof IUserPreferences,
          preferenceValue
        )
      )
      .filter(Boolean) as string[]; // Remove undefined descriptions

    return descriptions.join(" ");
  } catch (error) {
    Logger("userPreferencesInstruction").error(error);
    throw error;
  }
};
