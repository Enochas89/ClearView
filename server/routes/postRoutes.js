import { Router } from "express"
import { protect } from "../middleware/authMiddleware.js"
import { list, create, like, addComment } from "../controllers/postController.js"

const router = Router()
router.get("/", protect, list)
router.post("/", protect, create)
router.post("/:id/like", protect, like)
router.post("/:id/comments", protect, addComment)
export default router
