import { Router } from "express";
import { temporaryAuth } from "../../../../shared/middlewares/temporaryAuth.middleware";
import * as settingController from "../../controllers/setting.controller";

const router = Router();

router.post("/", temporaryAuth, settingController.createSetting);
router.get("/", temporaryAuth, settingController.getSettings);
router.get("/:key", temporaryAuth, settingController.getSettingsByKey);
router.put("/", temporaryAuth, settingController.updateSetting);

export default router;
