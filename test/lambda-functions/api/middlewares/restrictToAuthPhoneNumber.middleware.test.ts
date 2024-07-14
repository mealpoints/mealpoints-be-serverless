import { NextFunction, Request, Response } from "express";
import { restrictToAuthPhoneNumbers } from "../../../../lambda-functions/api/middlewares/restrictToAuthPhoneNumber.middleware";
import { WebhookObject } from "../../../../shared/types/message";
import ApiResponse from "../../../../shared/utils/ApiResponse";
import { WhatsappData } from "../../../../shared/utils/WhatsappData";

jest.mock("../../../../shared/utils/WhatsappData");

describe("RestrictToAuthPhoneNumber Middleware", () => {
  let request: Partial<Request>;
  let response: Partial<Response>;
  let next: NextFunction;
  let jsonResponse: jest.SpyInstance;

  beforeEach(() => {
    request = {
      body: {},
    };
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jsonResponse = jest
      .spyOn(ApiResponse, "Ok")
      .mockReturnValue(response as Response);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 but not call next() when the phone number is not authorized", () => {
    (WhatsappData as jest.Mock).mockImplementation(() => {
      return {
        isMessageFromWatsappPhoneNumberId: jest.fn().mockReturnValue(true),
      };
    });

    request.body = {} as WebhookObject;

    restrictToAuthPhoneNumbers(request as Request, response as Response, next);

    expect(next).toHaveBeenCalled();
    expect(jsonResponse).not.toHaveBeenCalled();
  });

  it("should call next() when the phone number is authorized", () => {
    (WhatsappData as jest.Mock).mockImplementation(() => {
      return {
        isMessageFromWatsappPhoneNumberId: jest.fn().mockReturnValue(false),
      };
    });

    request.body = {} as WebhookObject;

    restrictToAuthPhoneNumbers(request as Request, response as Response, next);

    expect(next).not.toHaveBeenCalled();
    expect(jsonResponse).toHaveBeenCalledWith(response);
  });
});
