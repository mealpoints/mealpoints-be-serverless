import {
  APIGatewayProxyEvent,
  APIGatewayProxyResultV2,
  Context,
} from "aws-lambda";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import serverless from "serverless-http";
import { CORS_OPTIONS } from "../../shared/config/config";
import { connectToDatabase } from "../../shared/config/database";
import logger from "../../shared/config/logger";
import { errorHandler } from "../../shared/middlewares/error";
import { notFoundHandler } from "../../shared/middlewares/notFound";
import routes from "./routes";

export const app = express();

app.use(cors(CORS_OPTIONS));

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
app.use(morgan("combined", { stream: logger.stream }));

app.use(express.json());

app.use("/api", routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

const serverlessHandler = serverless(app);

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResultV2> => {
  await connectToDatabase();
  return serverlessHandler(event, context);
};
