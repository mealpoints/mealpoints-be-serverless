import { getInstructionForUser } from "../../../shared/utils/user";
import { DataService } from "../../test_utils/DataService";

describe("getInstructionForUser", () => {
  it("should return the instruction for the user", async () => {
    const user = DataService.getInstance().getUser();
    const instructions = await getInstructionForUser(user);
    expect(instructions).toBeDefined();
  });
});
