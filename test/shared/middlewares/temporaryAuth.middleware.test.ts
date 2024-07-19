// temporaryAuth.test.ts

import express, { Request, Response } from "express";
import request from "supertest";
import { temporaryAuth } from "../../../shared/middlewares/temporaryAuth.middleware";
import ApiResponse from "../../../shared/utils/ApiResponse";

// Mock the ApiResponse
jest.mock("../../../shared/utils/ApiResponse");

describe.skip("temporaryAuth middleware", () => {
  const app = express();
  app.use(temporaryAuth);
  app.get("/", (request_, response) => response.send("Success"));

  const temporaryAuthToken = process.env.TEMPORARY_AUTH_TOKEN as string;

  beforeAll(() => {
    process.env.TEMPORARY_AUTH_TOKEN = "test_token";
  });

  afterAll(() => {
    process.env.TEMPORARY_AUTH_TOKEN = temporaryAuthToken;
  });

  it("should return Unauthorized if no authorization header is provided", async () => {
    const response = await request(app).get("/");
    expect(ApiResponse.Unauthorized).toHaveBeenCalled();
    expect(response.status).toBe(401);
  });

  it("should return Unauthorized if the authorization header is incorrect", async () => {
    const response = await request(app)
      .get("/")
      .set("Authorization", "wrong_token");
    expect(ApiResponse.Unauthorized).toHaveBeenCalled();
    expect(response.status).toBe(401);
  });

  it("should call next() if the authorization header is correct", () => {
    const nextFunction = jest.fn();

    const request = {
      headers: {
        authorization: "test_token",
      },
    } as unknown as Request;

    const response = {} as Response;

    temporaryAuth(request, response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
  });
});
