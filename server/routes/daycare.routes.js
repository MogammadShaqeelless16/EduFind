import express from "express";

import {
    createDayCare,
    deleteDaycare,
    getAllDaycare,
    getDaycareDetail,
    updateDaycare,
} from "../controllers/daycare.controller.js";

const router = express.Router();

router.route("/").get(getAllDaycare);
router.route("/:id").get(getDaycareDetail);
router.route("/").post(createDayCare);
router.route("/:id").patch(updateDaycare);
router.route("/:id").delete(deleteDaycare);

export default router;