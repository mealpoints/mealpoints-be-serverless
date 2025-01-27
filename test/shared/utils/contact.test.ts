import { ensureContactFormat } from "../../../shared/utils/contact";

describe("ensureContactFormat", () => {
  test("should return the formatted E.164 number as numeric string", () => {
    expect(ensureContactFormat("+91-7022928829")).toBe("917022928829");
    expect(ensureContactFormat("+49-151-12345678")).toBe("4915112345678");
  });

  test("shuld handle contact numbers with + prefix", () => {
    expect(ensureContactFormat("+917022928829")).toBe("917022928829");
    expect(ensureContactFormat("+4915112345678")).toBe("4915112345678");
  });

  test("should return undefined for invalid inputs", () => {
    expect(ensureContactFormat("abc123")).toBeUndefined();
    expect(ensureContactFormat("12345")).toBeUndefined();
  });

  test("should return undefined for numbers without country code", () => {
    expect(ensureContactFormat("7022928829")).toBeUndefined();
    expect(ensureContactFormat("07022928829")).toBeUndefined();
  });

  test("should handle valid international formats", () => {
    expect(ensureContactFormat("+44 20 7946 0958")).toBe("442079460958");
    expect(ensureContactFormat("+49 151 12345678")).toBe("4915112345678");
  });

  test("should handle already correct formats", () => {
    expect(ensureContactFormat("917022928829")).toBe("917022928829");
    expect(ensureContactFormat("4915112345678")).toBe("4915112345678");
  });
});
