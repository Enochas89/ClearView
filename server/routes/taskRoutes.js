import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { list, create, move, resize, progress } from "../controllers/taskController.js";

const router = Router();

router.get("/", protect, list);
router.post("/", protect, create);
router.patch("/:id/move", protect, move);
router.patch("/:id/resize", protect, resize);
router.patch("/:id/progress", protect, progress);

export default router;
