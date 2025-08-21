import { Router } from "express"
import { protect } from "../middleware/authMiddleware.js"
import { history } from "../controllers/chatController.js"
const router=Router()
router.get("/:projectId/messages",protect,history)
export default router
