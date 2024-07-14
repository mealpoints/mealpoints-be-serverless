import { Document, Schema, model } from "mongoose";
import { SettingEnum } from "../types/enums";

export type SettingValue = string | boolean | number;

export interface ISetting extends Document {
  key: SettingEnum;
  value: SettingValue;
}

export interface ISettingCreate extends Partial<ISetting> {
  key: SettingEnum;
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
