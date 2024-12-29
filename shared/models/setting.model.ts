import { Document, Schema, model } from "mongoose";

export type SettingValue = string | boolean | number | string[] | number[];
export type SettingKey =
  | "openai.assistant.mealpoints-core"
  | "openai.assistant.meal-summary"
  | "openai.assistant.global-instruction"
  | "openai.assistant.meal-reports"
  | "blacklist"
  | "ui.home.plan"
  | "rate-limit.message-limit-per-day"
  | "internal-alerts.alert-list"
  | "open-ai.max-runs-on-a-thread"
  | "open-ai.max-retries"
  | "user-engagement.max-reminders"
  | "user-engagement.flows"
  | "user-engagement.flows.window-in-minutes"
  | "user-engagement.interval-in-days"
  | "subscription.exempt-contacts"
  | "user-engagement.remind-meal-via-text.interval-in-days"
  | "user-engagement.remind-meal-via-text.no-meals-in-days";

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

settingSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (document, returnValue) {
    returnValue.id = returnValue._id;
    delete returnValue._id;
  },
});

// Create an index on the key key
settingSchema.index({ key: 1 });

// Create and export the model
const Setting = model<ISetting>("Setting", settingSchema);
export default Setting;
