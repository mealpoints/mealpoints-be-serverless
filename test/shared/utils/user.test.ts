import { getInstructionForUser } from "../../../shared/utils/user";
import { DataService } from "../../test_utils/DataService";

describe("getInstructionForUser", () => {
  it("should return the instruction for the user", () => {
    const user = DataService.getInstance().getUser();
    const instructions = getInstructionForUser(user);
    expect(instructions).toBeDefined();
  });
});
