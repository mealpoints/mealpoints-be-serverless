import { Document, Schema, model } from "mongoose";

export type SettingValue = string | boolean | number | string[] | number[];
export type SettingKey =
  | "openai.assistant.mealpoints-core"
  | "openai.assistant.mealpoints-not-core"
  | "openai.assistant.reminder"
  | "openai.assistant.meal-summary"
  | "blacklist"
  | "rate-limit.message-limit-per-day"
  | "internal-alerts.alert-list"
  | "open-ai.max-runs-on-a-thread"
  | "open-ai.max-retries"
  | "user-engangement.last-consumed-meal"
  | "user-engangement.max-reminders"
  | "user-engangement.interval-in-days";

export interface ISetting extends Document {
  key: SettingKey;
  value: SettingValue;
}

export interface ISettingCreate extends Partial<ISetting> {
  key: SettingKey;
  value: SettingValue;
}
const settingSchema = new Schema<ISetting>({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true },
});

// Create an index on the key key
settingSchema.index({ key: 1 });

// Create and export the model
const Setting = model<ISetting>("Setting", settingSchema);
export default Setting;
