import { Router } from "express";
import * as bffController from "../../controllers/bff.controller";

const router = Router();

router.get("/home", bffController.home);

export default router;
