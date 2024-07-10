import { Response } from "express";

export default {
  // Custom response
  CustomResponse: (
    response: Response,
    status: number,
    messsage: string
  ): Response => {
    return response.status(status).json(messsage);
  },

  // 200 Ok
  Ok: (response: Response, data = {}): Response => {
    return response.status(200).json(data);
  },

  // 201 Ok
  Created: (response: Response, data = {}): Response => {
    return response.status(201).json(data);
  },

  // 204 No Content
  NoContent: (response: Response): Response => {
    return response.status(204).json();
  },

  // 400 Bad request
  BadRequest: (response: Response, message = "Bad request"): Response => {
    return response.status(400).json({ message });
  },

  // 401 Unauthorized
  Unauthorized: (
    response: Response,
    message = "Unauthorized access"
  ): Response => {
    return response.status(401).json({ message });
  },

  // 402 PaymentRequired
  PaymentRequired: (
    response: Response,
    message = "Payment Required"
  ): Response => {
    return response.status(402).json({ message });
  },

  // 403 Forbidden
  Forbidden: (response: Response, message = "Forbidden Access"): Response => {
    return response.status(403).json({ message });
  },

  // 404 Not found
  NotFound: (response: Response, message = "Not found"): Response => {
    return response.status(404).json({ message });
  },

  // 415 Unsupported media type
  UnsupportedMediaType: (
    response: Response,
    message = "Unsupported media type"
  ): Response => {
    return response.status(415).json({ message });
  },

  // 422 Unprocessable Entity
  UnprocessableEntity: (response: Response, message: string): Response => {
    return response.status(422).json({ message });
  },

  // 500 Server error
  ServerError: (
    response: Response,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any,
    message = "Internal server error"
  ): Response => {
    return response.status(500).json({ message });
  },
};
