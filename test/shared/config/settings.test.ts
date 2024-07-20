import SettingsSingleton from "../../../shared/config/settings";
import * as settingService from "../../../shared/services/setting.service";

describe("Settings", () => {
  it("should return an instance of SettingsSingleton", async () => {
    const settings = await SettingsSingleton.getInstance();
    expect(settings).toBeInstanceOf(SettingsSingleton);
  });

  it("should return the value of the setting", async () => {
    const settings = await SettingsSingleton.getInstance();
    const setting = await settings.get("openai_assistant_id");
    const assistantIdInDatabase = await settingService.getSettingByKey(
      "openai_assistant_id"
    );
    expect(setting).toBe(assistantIdInDatabase?.value);
  });
});
