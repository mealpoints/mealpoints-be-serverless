import request from "supertest";
import { app } from "../../../../lambda-functions/settings/app";
import { DataService } from "../../../test_utils/DataService";

const PATH = "/settings/v1/setting";
const temporaryAuth = "flbadmaash";

const dataService = DataService.getInstance();

describe("Setting End To End", () => {
  describe("getSettings", () => {
    it("should return all settings", async () => {
      const response = await request(app)
        .get(PATH)
        .set({ Authorization: temporaryAuth });

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.length).toBe(dataService.getSettings().length);
    });
  });

  it("should return a setting by id", async () => {
    const response = await request(app)
      .get(`${PATH}/${dataService.getSettings()[0].key}`)
      .set({ Authorization: temporaryAuth });

    expect(response.status).toBe(200);
    expect(response.body).toBe(dataService.getSettings()[0].value);
  });
});
