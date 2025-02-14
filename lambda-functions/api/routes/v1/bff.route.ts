import { Router } from "express";
import * as bffController from "../../controllers/bff.controller";

const router = Router();

router.get("/home", bffController.home);
router.get("/checkout", bffController.checkout);

export default router;
