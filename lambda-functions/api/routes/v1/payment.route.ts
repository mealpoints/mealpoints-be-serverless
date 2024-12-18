import { Router } from "express";
import * as paymentController from "../../controllers/payment.controller";
const router = Router();

router.post("/order", paymentController.createOrder);
router.post("/validate", paymentController.validatePayment);

export default router;
