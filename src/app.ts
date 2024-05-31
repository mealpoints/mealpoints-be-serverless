import express from "express";
import serverless from "serverless-http";

import routes from "./routes";
import APIResponse from "./utils/APIResponse";
import { connectToDatabase } from "./config/db";

const app = express();

app.use(express.json());

app.use("/", routes);

// Error handling
// 404
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    return APIResponse.NotFound(res);
  }
);

// 500
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    return APIResponse.ServerError(res, err);
  }
);

export const handler = serverless(app);
