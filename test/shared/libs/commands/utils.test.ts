import { containsCommand } from "../../../../shared/libs/commands/utils";

describe("containsCommand", () => {
  it("should return true if the command is in the list", () => {
    expect(containsCommand("#refund", "#refund")).toBe(true);
  });

  it("should return false if the command is not in the list", () => {
    expect(containsCommand("hello", "#refund")).toBe(false);
  });

  it("should return true if the command is in the list but in different case", () => {
    expect(containsCommand("#Refund", "#refund")).toBe(true);
  });

  it("should throw an error if the message is empty", () => {
    expect(() => containsCommand("", "#refund")).toThrowError(
      "Both 'message' and 'keyword' must be provided and non-empty."
    );
  });

  it("should throw an error if the keyword is empty", () => {
    expect(() => containsCommand("hello", "")).toThrowError(
      "Both 'message' and 'keyword' must be provided and non-empty."
    );
  });

  it("should throw an error if the message and keyword are empty", () => {
    expect(() => containsCommand("", "")).toThrowError(
      "Both 'message' and 'keyword' must be provided and non-empty."
    );
  });

  it("should work with extra spaces", () => {
    expect(containsCommand("   #refund  ", "#refund")).toBe(true);
  });

  it.skip("should return false if the command is a substring of another word", () => {
    expect(containsCommand("hello#refundworld", "#refund")).toBe(false);
  });

  it("should return true if the command is at the beginning of the message", () => {
    expect(containsCommand("#refund hello world", "#refund")).toBe(true);
  });

  it("should return true if the command is at the end of the message", () => {
    expect(containsCommand("hello world #refund", "#refund")).toBe(true);
  });

  it("should return true if the command is in the middle of the message", () => {
    expect(containsCommand("hello #refund world", "#refund")).toBe(true);
  });

  it("should return true if the command is not a standalone word", () => {
    expect(containsCommand("hello#refund", "#refund")).toBe(true);
  });

  it("should return true if the command is surrounded by punctuation", () => {
    expect(containsCommand("hello, #refund! world.", "#refund")).toBe(true);
  });

  it.skip("should return false if the command is part of another command", () => {
    expect(containsCommand("#refundextra", "#refund")).toBe(false);
  });

  it("should return true if the command is repeated in the message", () => {
    expect(containsCommand("#refund #refund", "#refund")).toBe(true);
  });

  it("should return true if the command is in a different case and surrounded by spaces", () => {
    expect(containsCommand("   #ReFund  ", "#refund")).toBe(true);
  });
});
