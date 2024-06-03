import express, { Request, Response } from "express";
import serverless from "serverless-http";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResultV2,
  Context,
} from "aws-lambda";
import { connectToDatabase } from "./config/database";
import routes from "./routes";
import ApiResponse from "./utils/ApiResponse";

const app = express();

// Init
import "./config/init";

app.use(express.json());

app.use("/", routes);

// Error handling
// 404
app.use((request: Request, response: Response) => {
  return ApiResponse.NotFound(response);
});

// 500
app.use(
  (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any,
    request: Request,
    response: Response
  ) => {
    return ApiResponse.ServerError(response, error);
  }
);

const serverlessHandler = serverless(app);

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResultV2> => {
  await connectToDatabase();
  return serverlessHandler(event, context);
};
