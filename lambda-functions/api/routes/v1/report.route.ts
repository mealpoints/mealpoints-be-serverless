import { Router } from "express";
import { temporaryAuth } from "../../../../shared/middlewares/temporaryAuth.middleware";
import * as reportController from "../../controllers/report.controller";

const router = Router();

router.get("/:reportId", temporaryAuth, reportController.getReport);

export default router;
