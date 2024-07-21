import request from "supertest";
import { app } from "../../../../lambda-functions/api/app";
import { DataService } from "../../../test_utils/DataService";

const PATH = "/api/v1/user-meal";
const temporaryAuth = "flbadmaash";

describe("UserMeal Controllers", () => {
  describe("getUserMealsByUserId", () => {
    it("should return paginated usermeals", async () => {
      const userId = DataService.getInstance().getUser().id;
      const response = await request(app)
        .get(`${PATH}/user/${userId}`)
        .set({ Authorization: temporaryAuth });

      expect(response.status).toBe(200);
      expect(response.body.documents).toBeDefined();
      expect(response.body.totalDocuments).toBeDefined();
      expect(response.body.limit).toBeDefined();
      expect(response.body.totalPages).toBeDefined();
      expect(response.body.pagingCounter).toBeDefined();
      expect(response.body.hasPrevPage).toBeDefined();
      expect(response.body.hasNextPage).toBeDefined();
      expect(response.body.prevPage).toBeDefined();
      expect(response.body.nextPage).toBeDefined();
    });
  });
});
