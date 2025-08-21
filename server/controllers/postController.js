import mongoose from "mongoose"
import Post from "../models/Post.js"

const isDay = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s) // YYYY-MM-DD

// GET /api/posts?projectId=...&day=YYYY-MM-DD
export async function list(req, res) {
  try {
    const { projectId, day } = req.query
    const filter = {}

    if (projectId) {
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).json({ message: "Invalid 'projectId'" })
      }
      filter.project = projectId
    }
    if (day) {
      if (!isDay(day)) return res.status(400).json({ message: "Invalid 'day' (YYYY-MM-DD)" })
      filter.day = day
    }

    const posts = await Post.find(filter).sort({ createdAt: -1 })
    return res.json(posts)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: "Failed to fetch posts" })
  }
}

// POST /api/posts
export async function create(req, res) {
  try {
    const { project, day, type, content } = req.body
    if (!project || !mongoose.Types.ObjectId.isValid(project)) {
      return res.status(400).json({ message: "Invalid or missing 'project' id" })
    }
    if (!day || !/^\d{4}-\d{2}-\d{2}$/.test(day)) {
      return res.status(400).json({ message: "Invalid or missing 'day' (YYYY-MM-DD)" })
    }
    if (!content?.trim()) {
      return res.status(400).json({ message: "Missing 'content'" })
    }
    const allowed = ["RFI", "POST", "UPDATE"]
    if (type && !allowed.includes(type)) {
      return res.status(400).json({ message: "Invalid 'type' (RFI|POST|UPDATE)" })
    }
    const p = await Post.create({
      project,
      day,
      type: type || "POST",
      content: content.trim(),
      author: req.user?.id || null
    })
    return res.json(p)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: "Failed to create post" })
  }
}

// POST /api/posts/:id/like
export async function like(req, res) {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid post id" })
    const updated = await Post.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true })
    if (!updated) return res.status(404).json({ message: "Post not found" })
    return res.json(updated)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: "Failed to like post" })
  }
}

// POST /api/posts/:id/comments  body: { text }
export async function addComment(req, res) {
  try {
    const { id } = req.params
    const { text } = req.body
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid post id" })
    if (!text?.trim()) return res.status(400).json({ message: "Missing 'text'" })

    const updated = await Post.findByIdAndUpdate(
      id,
      { $push: { comments: { text: text.trim(), author: req.user?.id || null } } },
      { new: true }
    )
    if (!updated) return res.status(404).json({ message: "Post not found" })
    return res.json(updated)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: "Failed to add comment" })
  }
}
