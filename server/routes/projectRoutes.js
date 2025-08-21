import { Router } from "express"
import { protect } from "../middleware/authMiddleware.js"
import { list, create, exists } from "../controllers/projectController.js"

const router = Router()
router.get("/", protect, list)
router.post("/", protect, create)
router.get("/exists", protect, exists) // ?projectId=ABC

export default router
