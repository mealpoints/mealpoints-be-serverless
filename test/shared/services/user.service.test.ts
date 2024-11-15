import logger from "../../../shared/config/logger";
import * as userService from "../../../shared/services/user.service";
import { USER } from "../../mocks/user.mock";
const Logger = logger("test/shared/services/user.service.test");

describe("UserService", () => {
    it("should create a user", async () => {
        Logger("createUser").info("");
        const user = await userService.createUser(USER)
        expect(user).toBeDefined();
    })
});