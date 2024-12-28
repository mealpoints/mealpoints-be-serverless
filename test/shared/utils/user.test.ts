import { IUser } from "../../../shared/models/user.model";
import { getTodaysUserMealsByUserId } from "../../../shared/services/userMeal.service";
import { getLocaleTimeInTimezone } from "../../../shared/utils/timezone";
import { getInstructionForUser } from "../../../shared/utils/user";
import { userPreferencesInstruction } from "../../../shared/utils/userPreferences";
import { DataService } from "../../test_utils/DataService";

jest.mock("../../../shared/services/userMeal.service");
jest.mock("../../../shared/utils/timezone");
jest.mock("../../../shared/utils/userPreferences");

describe("getInstructionForUser", () => {
  it("should return the instruction for the user", async () => {
    const user = DataService.getInstance().getUser();
    const instructions = await getInstructionForUser(user);
    expect(instructions).toBeDefined();
  });

  it("should return the combined instructions for the user", async () => {
    const user: IUser = {
      id: "123",
      timezone: "America/New_York",
      countryCode: "US",
    } as IUser;
    const mockMeals = [{ name: "Breakfast", createdAt: new Date() }];
    const mockTime = "10:00 AM";
    const mockPreferences = "User prefers vegetarian meals.";

    (getTodaysUserMealsByUserId as jest.Mock).mockResolvedValue(mockMeals);
    (getLocaleTimeInTimezone as jest.Mock).mockReturnValue(mockTime);
    (userPreferencesInstruction as jest.Mock).mockReturnValue(mockPreferences);

    const result = await getInstructionForUser(user);

    expect(result).toContain("The user is from United States");
    expect(result).toContain("Breakfast at 10:00 AM");
    expect(result).toContain("User prefers vegetarian meals.");
  });

  it("should handle errors gracefully", async () => {
    const user: IUser = {
      id: "123",
      timezone: "America/New_York",
      countryCode: "US",
    } as IUser;

    (getTodaysUserMealsByUserId as jest.Mock).mockRejectedValue(
      new Error("Error fetching meals")
    );
    (getLocaleTimeInTimezone as jest.Mock).mockReturnValue("10:00 AM");
    (userPreferencesInstruction as jest.Mock).mockReturnValue(
      "User prefers vegetarian meals."
    );

    const result = await getInstructionForUser(user);

    expect(result).toContain("The user is from United States");
    expect(result).toContain("User prefers vegetarian meals.");
  });
});
