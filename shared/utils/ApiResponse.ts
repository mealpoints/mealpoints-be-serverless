/* eslint-disable unicorn/no-static-only-class */
import { Response } from "express";

class ApiResponse {
  // Custom response
  static CustomResponse(
    response: Response,
    status: number,
    message: string,
    type: "json" | "text" = "text"
  ): Response {
    if (type === "json") {
      return response.status(status).json(message);
    }
    return response.status(status).send(message);
  }

  // 200 Ok
  static Ok<T>(response: Response, data: T = {} as T): Response {
    return response.status(200).json(data);
  }

  // 201 Created
  static Created<T>(response: Response, data: T = {} as T): Response {
    return response.status(201).json(data);
  }

  // 204 No Content
  static NoContent(response: Response): Response {
    return response.status(204).json();
  }

  // 400 Bad Request
  static BadRequest(
    response: Response,
    message: string | object = "Bad request"
  ): Response {
    return response.status(400).json({ message });
  }

  // 401 Unauthorized
  static Unauthorized(
    response: Response,
    message: string = "Unauthorized access"
  ): Response {
    return response.status(401).json({ message });
  }

  // 402 Payment Required
  static PaymentRequired(
    response: Response,
    message: string = "Payment Required"
  ): Response {
    return response.status(402).json({ message });
  }

  // 403 Forbidden
  static Forbidden(
    response: Response,
    message: string = "Forbidden Access"
  ): Response {
    return response.status(403).json({ message });
  }

  // 404 Not Found
  static NotFound(response: Response, message: string = "Not found"): Response {
    return response.status(404).json({ message });
  }

  // 409 Conflict
  static Conflict(response: Response, message: string): Response {
    return response.status(409).json({ message });
  }

  // 415 Unsupported Media Type
  static UnsupportedMediaType(
    response: Response,
    message: string = "Unsupported media type"
  ): Response {
    return response.status(415).json({ message });
  }

  // 422 Unprocessable Entity
  static UnprocessableEntity(response: Response, message: string): Response {
    return response.status(422).json({ message });
  }

  // 500 Internal Server Error
  static ServerError(
    response: Response,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any,
    message: string = "Internal server error"
  ): Response {
    return response.status(500).json({ message });
  }
}

export default ApiResponse;
