import { userPreferencesInstruction } from "../../../shared/utils/userPreferences";
import { IUser } from "./../../../shared/models/user.model";
import { getUserPreferencesByUserId } from "./../../../shared/services/userPreferences.service";

jest.mock("./../../../shared/services/userPreferences.service");

describe("userPreferencesInstruction", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a combined instruction string for valid user preferences", async () => {
    const mockUser = { id: "123" } as IUser;
    const mockPreferences = {
      birthYear: 1990,
      gender: "female",
      height: { value: 165, unit: "cm" },
      diet: "vegetarian",
      language: "English",
    };

    (getUserPreferencesByUserId as jest.Mock).mockResolvedValue(
      mockPreferences
    );

    const result = await userPreferencesInstruction(mockUser);

    expect(getUserPreferencesByUserId).toHaveBeenCalledWith(mockUser.id);
    expect(result).toContain("They were born in 1990.");
    expect(result).toContain("They identify as female.");
    expect(result).toContain("Their height is 165 cm.");
    expect(result).toContain('Their preferred diet is: "vegetarian".');
    expect(result).toContain(
      "Their language preference of this conversation is English. Hence Reply in English language."
    );
  });

  it("should handle missing or undefined user preferences gracefully", async () => {
    const mockUser = { id: "456" } as IUser;
    const mockPreferences = {
      birthYear: undefined,
      height: { value: undefined, unit: "cm" },
    };

    (getUserPreferencesByUserId as jest.Mock).mockResolvedValue(
      mockPreferences
    );

    const result = await userPreferencesInstruction(mockUser);

    expect(getUserPreferencesByUserId).toHaveBeenCalledWith(mockUser.id);
    expect(result).toBe("");
  });

  it("should log and return an empty string if no preferences are found", async () => {
    const mockUser = { id: "789" } as IUser;

    (getUserPreferencesByUserId as jest.Mock).mockResolvedValue(undefined);

    const result = await userPreferencesInstruction(mockUser);

    expect(getUserPreferencesByUserId).toHaveBeenCalledWith(mockUser.id);
    expect(result).toBe("");
  });

  it("should log and rethrow an error if fetching preferences fails", async () => {
    const mockUser = { id: "000" } as IUser;
    const mockError = new Error("Error fetching user preferences");

    (getUserPreferencesByUserId as jest.Mock).mockRejectedValue(mockError);

    await expect(userPreferencesInstruction(mockUser)).rejects.toThrow(
      mockError
    );

    expect(getUserPreferencesByUserId).toHaveBeenCalledWith(mockUser.id);
  });
});
