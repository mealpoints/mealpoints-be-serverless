import { Router } from "express";
import { temporaryAuth } from "../../../../shared/middlewares/temporaryAuth.middleware";
import * as mealReportController from "../../controllers/mealReport.controller";

const router = Router();

router.get("/:mealReportId", temporaryAuth, mealReportController.getMealReport);

export default router;
