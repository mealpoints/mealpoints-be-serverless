import SettingsSingleton from "../../../shared/config/settings";
import * as opeanAIService from "../../../shared/services/openAI.service";
import { OpenAIMessageTypesEnum } from "../../../shared/types/enums";
import { NutritionalData } from "../../../shared/types/openai";
import { CONVERSATION } from "../../mocks/conversation.mock";
import { IMAGES } from "../../mocks/images.mock";
import { USER } from "../../mocks/user.mock";

// Create a mock instance of the SettingsSingleton
const mockSettingsInstance = {
  get: jest.fn(),
};

SettingsSingleton.getInstance = jest
  .fn()
  .mockResolvedValue(mockSettingsInstance);

describe("OpenAI Service", () => {
  beforeEach(() => {
    const expectedAssistantId = process.env.OPENAI_ASSISTANT_ID;
    mockSettingsInstance.get.mockResolvedValue(expectedAssistantId);
  });

  it.only("should return response from OpenAI when message type is Text", async () => {
    // @ts-expect-error - We are passing a dummy user object
    const result = await opeanAIService.ask("hi there", USER, CONVERSATION, {
      messageType: OpenAIMessageTypesEnum.Text,
    });

    expect(result.message).toBeDefined();
  }, 30000); // Five minutes timeout

  it("should return response from OpenAI when message type is Image", async () => {
    const result = await opeanAIService.ask(
      IMAGES.chocolateWaffle,
      // @ts-expect-error - We are passing a dummy user object
      USER,
      CONVERSATION,
      {
        messageType: OpenAIMessageTypesEnum.Image,
      }
    );
    console.log(result);

    expect(result.message).toBeDefined();
    expect(result.data).toBeDefined();
    if (result.data) {
      // Check if data contains meal_name, score, and macros
      expect(result.data.meal_name).not.toBe("");
      expect(result.data.score).toBeDefined();
      expect(result.data.macros).toBeDefined();

      // Check if score contains value and total
      expect(result.data.score.value).toBeGreaterThan(0);
      expect(result.data.score.total).toBeGreaterThan(0);

      // Check if macros contain all required nutrients
      expect(result.data.macros.calories).toBeDefined();
      expect(result.data.macros.protein).toBeDefined();
      expect(result.data.macros.fat).toBeDefined();
      expect(result.data.macros.carbohydrates).toBeDefined();
      expect(result.data.macros.fiber).toBeDefined();
      expect(result.data.macros.sugars).toBeDefined();

      // Check if each nutrient has value and unit
      const macros: NutritionalData = result.data.macros;
      for (const key of Object.keys(macros) as (keyof NutritionalData)[]) {
        expect(macros[key].value).toBeGreaterThan(0);
        expect(macros[key].unit).not.toBe("");
      }
    }
  }, 30000);

  it("should return response from OpenAI when message type is not a food image. but meal data is not present.", async () => {
    const result = await opeanAIService.ask(
      IMAGES.motorbike,
      // @ts-expect-error - We are passing a dummy user object
      USER,
      CONVERSATION,
      {
        messageType: OpenAIMessageTypesEnum.Image,
      }
    );
    console.log(result);

    expect(result.message).toBeDefined();
    expect(result.data).toBeDefined();
    if (result.data) {
      // Check if data contains meal_name, score, and macros
      expect(result.data.meal_name).toBe("");
      expect(result.data.score.value).toBe(0);
    }
  }, 30000);
});
