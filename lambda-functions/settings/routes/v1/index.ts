import { Router } from "express";

import setting from "./setting.route";

const router = Router();

router.use("/setting", setting);

export default router;
