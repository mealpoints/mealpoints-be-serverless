import {
  getDate,
  getNumber,
} from "../../../../../../lambda-functions/message-processor/lib/whatsapp/flows/utils";

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
