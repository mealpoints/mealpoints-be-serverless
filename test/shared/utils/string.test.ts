import {
  convertToHumanReadableMessage,
  isValidJsonString,
} from "../../../shared/utils/string";

describe("convertToHumanReadableMessage", () => {
  it("should replace escaped newlines with actual newlines", () => {
    const input = String.raw`Hello\nWorld`;
    const expectedOutput = "Hello\nWorld";
    expect(convertToHumanReadableMessage(input)).toBe(expectedOutput);
  });

  it("should replace escaped single quotes with actual single quotes", () => {
    const input = String.raw`It\'s a test`;
    const expectedOutput = "It's a test";
    expect(convertToHumanReadableMessage(input)).toBe(expectedOutput);
  });

  it("should replace escaped double quotes with actual double quotes", () => {
    const input = String.raw`He said, \"Hello\"`;
    const expectedOutput = 'He said, "Hello"';
    expect(convertToHumanReadableMessage(input)).toBe(expectedOutput);
  });

  it("should replace escaped tabs with actual tabs", () => {
    const input = String.raw`Hello\tWorld`;
    const expectedOutput = "Hello\tWorld";
    expect(convertToHumanReadableMessage(input)).toBe(expectedOutput);
  });

  it("should trim leading and trailing whitespace", () => {
    const input = "   Hello World   ";
    const expectedOutput = "Hello World";
    expect(convertToHumanReadableMessage(input)).toBe(expectedOutput);
  });

  it("should handle a combination of escaped characters", () => {
    const input = String.raw`Hello\nWorld\tIt\'s a \"test\"`;
    const expectedOutput = 'Hello\nWorld\tIt\'s a "test"';
    expect(convertToHumanReadableMessage(input)).toBe(expectedOutput);
  });
});

describe("isValidJsonString", () => {
  it("should return true for a valid JSON string", () => {
    const jsonString = '{"name": "John", "age": 30}';
    expect(isValidJsonString(jsonString)).toBe(true);
  });

  it("should return false for an invalid JSON string", () => {
    const jsonString = '{"name": "John", "age": 30';
    expect(isValidJsonString(jsonString)).toBe(false);
  });

  it("should return false for a non-JSON string", () => {
    const nonJsonString = "Hello World";
    expect(isValidJsonString(nonJsonString)).toBe(false);
  });

  it("should return true for a valid JSON array string", () => {
    const jsonArrayString = '["apple", "banana", "cherry"]';
    expect(isValidJsonString(jsonArrayString)).toBe(true);
  });

  it("should return false for an invalid JSON array string", () => {
    const jsonArrayString = '["apple", "banana", "cherry"';
    expect(isValidJsonString(jsonArrayString)).toBe(false);
  });
});
