import SettingsSingleton from "../../../shared/config/settings";
import { DataService } from "../../test_utils/DataService";

describe("Settings", () => {
  const dataServiceSettings = DataService.getInstance().getSettings();

  it("should return an instance of SettingsSingleton", async () => {
    const settings = await SettingsSingleton.getInstance();
    expect(settings).toBeInstanceOf(SettingsSingleton);
  });

  it("should return the value of the setting", async () => {
    const settings = await SettingsSingleton.getInstance();
    const setting = settings.get("openai.assistant.mealpoints-core");
    const assistantIdInDatabase = dataServiceSettings.get(
      "openai.assistant.mealpoints-core"
    );
    expect(setting).toBe(assistantIdInDatabase);
  });
});
