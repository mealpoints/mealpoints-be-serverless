import {
  GenderEnum,
  PhysicalActivityEnum,
} from "../../../../../../shared/types/enums";
import {
  IOnboardingV1ParsedReply,
  validateOnboardingInputs,
} from "./../../../../../../lambda-functions/message-processor/lib/whatsapp/flows/onboardingV1";

const validParsedReply: IOnboardingV1ParsedReply = {
  screen_1_Target_Weight_0: "75", // Valid target weight
  screen_1_Target_Date_1: "2023-12-31", // Valid target date
  screen_0_Birthdate_0: "2000-01-01", // Valid birthdate
  screen_0_Gender_1: "0_Male", // Assuming "male" is correctly mapped to GenderEnum.Male
  screen_0_Height_2: "180", // Valid height
  screen_0_Current_Weight_3: "80", // Valid current weight
  screen_0_Physical_Activity_4: "2_Weekend_Hustler", // Assuming "moderate" is correctly mapped to PhysicalActivityEnum.Moderate
};

describe("validateOnboardingInputs function tests 🚀", () => {
  it("should return a valid parsed object when all inputs are correct 😎✅", () => {
    const result = validateOnboardingInputs(validParsedReply);
    expect(result.currentWeight).toBe(80);
    expect(result.height).toBe(180);
    expect(result.targetWeight).toBe(75);
    expect(result.birthDate).toEqual(new Date("2000-01-01"));
    expect(result.targetDate).toEqual(new Date("2023-12-31"));
    expect(result.gender).toBe(GenderEnum.Male);
    expect(result.physicalActivity).toBe(PhysicalActivityEnum.Moderate);
  });

  // --------------------------------------------------------------------------------
  // Test cases for individual invalid/missing fields:
  it("should throw an error if currentWeight is missing or invalid 🚫", () => {
    const invalidReply = {
      ...validParsedReply,
      screen_0_Current_Weight_3: "abc",
    };
    expect(() => validateOnboardingInputs(invalidReply)).toThrow(
      "Current Weight is missing or invalid"
    );
  });

  it("should throw an error if height is missing or invalid 🚫", () => {
    const invalidReply = { ...validParsedReply, screen_0_Height_2: "" };
    expect(() => validateOnboardingInputs(invalidReply)).toThrow(
      "Height is missing or invalid"
    );
  });

  it("should throw an error if targetWeight is missing or invalid 🚫", () => {
    const invalidReply = {
      ...validParsedReply,
      screen_1_Target_Weight_0: "not-a-number",
    };
    expect(() => validateOnboardingInputs(invalidReply)).toThrow(
      "Target Weight is missing or invalid"
    );
  });

  it("should throw an error if birthDate is missing or invalid 🚫", () => {
    const invalidReply = {
      ...validParsedReply,
      screen_0_Birthdate_0: "invalid-date",
    };
    expect(() => validateOnboardingInputs(invalidReply)).toThrow(
      "Birthdate is missing or invalid"
    );
  });

  it("should throw an error if targetDate is missing or invalid 🚫", () => {
    const invalidReply = {
      ...validParsedReply,
      screen_1_Target_Date_1: "invalid-date",
    };
    expect(() => validateOnboardingInputs(invalidReply)).toThrow(
      "Target Date is missing or invalid"
    );
  });

  it("should throw an error if gender is missing or invalid 🚫", () => {
    // Assuming that an unrecognized gender string will cause getGender to return undefined
    const invalidReply = { ...validParsedReply, screen_0_Gender_1: "unknown" };
    expect(() => validateOnboardingInputs(invalidReply)).toThrow(
      "Gender is missing or invalid"
    );
  });

  it("should throw an error if physicalActivity is missing or invalid 🚫", () => {
    // Assuming that an empty string will cause getPhysicalActivity to return undefined
    const invalidReply = {
      ...validParsedReply,
      screen_0_Physical_Activity_4: "",
    };
    expect(() => validateOnboardingInputs(invalidReply)).toThrow(
      "Physical Activity is missing or invalid"
    );
  });

  // --------------------------------------------------------------------------------
  // Test case for multiple errors simultaneously 😱
  it("should throw error with multiple error messages when multiple fields are invalid 😱", () => {
    const invalidReply = {
      ...validParsedReply,
      screen_0_Current_Weight_3: "abc", // invalid number
      screen_1_Target_Weight_0: "xyz", // invalid number
      screen_0_Birthdate_0: "not-a-date", // invalid date
    };
    try {
      validateOnboardingInputs(invalidReply);
      // If no error is thrown, force the test to fail
      fail("Expected an error to be thrown");
    } catch (error) {
      const errorMessage = (error as Error).message;
      expect(errorMessage).toMatch(/Current Weight is missing or invalid/);
      expect(errorMessage).toMatch(/Target Weight is missing or invalid/);
      expect(errorMessage).toMatch(/Birthdate is missing or invalid/);
    }
  });

  // --------------------------------------------------------------------------------
  // Test for missing keys in the input object 🧐
  it("should throw error when required keys are missing from the input object 🧐", () => {
    const incompleteReply = {
      // Omitting several required keys:
      screen_1_Target_Date_1: "2023-12-31",
      screen_0_Birthdate_0: "2000-01-01",
      // Missing: screen_1_Target_Weight_0, screen_0_Gender_1, screen_0_Height_2, screen_0_Current_Weight_3, screen_0_Physical_Activity_4
    } as Partial<typeof validParsedReply>;
    expect(() => validateOnboardingInputs(incompleteReply)).toThrow(
      /missing or invalid/
    );
  });
});
