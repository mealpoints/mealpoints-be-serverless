import User from "../../../shared/models/user.model";

describe("user Model", () => {
  describe("full name", () => {
    it("should store the full name", () => {
      const user = new User({ firstName: "John", lastName: "Doe" });
      expect(user.fullName).toBe("John Doe");
    });

    it("should trim the full name", () => {
      const user = new User({ firstName: " John ", lastName: " Doe " });
      expect(user.fullName).toBe("John Doe");
    });

    it("should handle missing first name", () => {
      const user = new User({ lastName: "Doe" });
      expect(user.fullName).toBe("Doe");
    });

    it("should handle missing last name", () => {
      const user = new User({ firstName: "John" });
      expect(user.fullName).toBe("John");
    });

    it("should handle missing first and last name", () => {
      const user = new User({});
      expect(user.fullName).toBeUndefined();
    });

    it("should handle empty first name", () => {
      const user = new User({ firstName: "", lastName: "Doe" });
      expect(user.fullName).toBe("Doe");
    });

    it("should handle empty last name", () => {
      const user = new User({ firstName: "John", lastName: "" });
      expect(user.fullName).toBe("John");
    });

    it("should handle empty first and last name", () => {
      const user = new User({ firstName: "", lastName: "" });
      expect(user.fullName).toBe(undefined);
    });
  });
});
