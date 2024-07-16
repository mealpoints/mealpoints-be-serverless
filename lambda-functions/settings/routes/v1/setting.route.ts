import { Router } from "express";
import * as settingController from "../../controllers/setting.controller";

const router = Router();

router.post("/", settingController.createSetting);
router.post("/seed", settingController.seedSettings);
router.get("/", settingController.getSettings);
router.put("/", settingController.updateSetting);

export default router;
