import { differenceInDays } from "date-fns";
import {
  calculateNutritionBudget,
  getAge,
  getDate,
  getDurationMonths,
  getNumber,
} from "../../../../../../lambda-functions/message-processor/lib/whatsapp/flows/utils";
import {
  GenderEnum,
  PhysicalActivityEnum,
} from "../../../../../../shared/types/enums";

describe("getNumber", () => {
  it("should return a number when a valid number string is passed", () => {
    expect(getNumber("123")).toBe(123);
  });

  it("should return undefined when an invalid number string is passed", () => {
    expect(getNumber("abc")).toBeUndefined();
  });

  it("should return undefined when an empty string is passed", () => {
    expect(getNumber("")).toBeUndefined();
  });

  it("should return a number when a string with leading and trailing spaces is passed", () => {
    expect(getNumber("  456  ")).toBe(456);
  });

  it("should return undefined when a string with only spaces is passed", () => {
    expect(getNumber("   ")).toBeUndefined();
  });

  it("should return a number when a string with a decimal number is passed", () => {
    expect(getNumber("123.45")).toBe(123.45);
  });

  it("should return undefined when a string with special characters is passed", () => {
    expect(getNumber("123abc")).toBeUndefined();
  });

  it("should return a number when a string with a negative number is passed", () => {
    expect(getNumber("-123")).toBe(-123);
  });

  it("should return undefined when undefined passed", () => {
    expect(getNumber(undefined)).toBeUndefined();
  });
});

describe("getDate", () => {
  it("should return a date when a valid date string is passed", () => {
    expect(getDate("2021-01-01")).toEqual(new Date("2021-01-01"));
  });

  it("should return undefined when an invalid date string is passed", () => {
    expect(getDate("abc")).toBeUndefined();
  });

  it("should return undefined when an empty string is passed", () => {
    expect(getDate("")).toBeUndefined();
  });

  it("should return a date when a string with leading and trailing spaces is passed", () => {
    expect(getDate("  2021-01-01  ")).toEqual(new Date("2021-01-01"));
  });

  it("should return undefined when a string with only spaces is passed", () => {
    expect(getDate("   ")).toBeUndefined();
  });

  it("should return undefined when a string with special characters is passed", () => {
    expect(getDate("2021-01-01abc")).toBeUndefined();
  });

  it("should return undefined when undefined passed", () => {
    expect(getDate(undefined)).toBeUndefined();
  });
});

describe("getAge function tests 🚀", () => {
  it("should return the correct age for a valid date", () => {
    const birthDate = new Date("2000-01-01");
    const currentDate = new Date();
    const expectedAge = currentDate.getFullYear() - birthDate.getFullYear();
    expect(getAge(birthDate)).toBe(expectedAge);
  });

  it("should return undefined for an invalid date", () => {
    const invalidDate = new Date("invalid");
    expect(getAge(invalidDate)).toBeUndefined();
  });
});

describe("getDurationMonths function tests", () => {
  it("should return 0 when the given date is the same as current date", () => {
    const now = new Date();
    expect(getDurationMonths(now)).toBeCloseTo(0, 2);
  });

  it("should calculate positive duration in months for an extremely future date", () => {
    const futureDate = new Date("2050-01-01T00:00:00Z");
    const daysDiff = differenceInDays(futureDate, new Date());
    const expectedMonths = daysDiff / 30.44;
    expect(getDurationMonths(futureDate)).toBeCloseTo(expectedMonths, 2);
  });
});

describe("calculateNutritionBudget - Excel Sheet Outcomes", () => {
  it("should calculate correct macros for a female weight gain scenario", () => {
    const input = {
      currentWeight: 60,
      height: 165,
      age: 25,
      gender: GenderEnum.Female,
      physicalActivity: PhysicalActivityEnum.Moderate,
      targetWeight: 65,
      durationMonths: 2,
    };

    const result = calculateNutritionBudget(input);
    expect(result.calories).toBe(2727);
    expect(result.protein).toBe(120);
    expect(result.carbohydrates).toBe(273);
    expect(result.fat).toBe(85);
  });

  it("should calculate correct macros for a male weight loss scenario", () => {
    const input = {
      currentWeight: 80,
      height: 180,
      age: 30,
      gender: GenderEnum.Male,
      physicalActivity: PhysicalActivityEnum.Moderate,
      targetWeight: 75,
      durationMonths: 2,
    };

    const result = calculateNutritionBudget(input);
    expect(result.calories).toBe(2117);
    expect(result.protein).toBe(160);
    expect(result.carbohydrates).toBe(212);
    expect(result.fat).toBe(66);
  });

  it("should return TDEE as the daily calorie target when there is no weight change", () => {
    const input = {
      currentWeight: 80,
      height: 180,
      age: 30,
      gender: GenderEnum.Male,
      physicalActivity: PhysicalActivityEnum.Moderate,
      targetWeight: 80,
      durationMonths: 2,
    };

    const result = calculateNutritionBudget(input);
    expect(result.calories).toBe(2759);
    expect(result.protein).toBe(160);
    expect(result.carbohydrates).toBe(276);
    expect(result.fat).toBe(86);
  });

  it("should handle zero durationMonths gracefully (avoiding division by zero)", () => {
    const input = {
      currentWeight: 60,
      height: 165,
      age: 25,
      gender: GenderEnum.Female,
      physicalActivity: PhysicalActivityEnum.Moderate,
      targetWeight: 65,
      durationMonths: 0,
    };
    const result = calculateNutritionBudget(input);
    expect(result.calories).toBe(130418);
    expect(result.protein).toBe(120);
    expect(result.carbohydrates).toBe(13042);
    expect(result.fat).toBe(4057);
  });

  it("should correctly handle rounding for daily calorie adjustment edge cases", () => {
    const inputGain = {
      currentWeight: 80,
      height: 170,
      age: 28,
      gender: GenderEnum.Female,
      physicalActivity: PhysicalActivityEnum.Moderate,
      targetWeight: 80 + 0.04091, // ≈80.04091 kg (gain)
      durationMonths: 1,
    };
    const resultGain = calculateNutritionBudget(inputGain);
    expect(resultGain.calories).toBe(2432);

    const inputLoss = {
      currentWeight: 80,
      height: 180,
      age: 30,
      gender: GenderEnum.Male,
      physicalActivity: PhysicalActivityEnum.Moderate,
      targetWeight: 80 - 0.04091, // ≈79.95909 kg (loss)
      durationMonths: 1,
    };
    const resultLoss = calculateNutritionBudget(inputLoss);
    expect(resultLoss.calories).toBe(2748);
  });
});
