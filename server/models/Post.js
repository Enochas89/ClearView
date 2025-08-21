import mongoose from "mongoose"

const commentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: false })

const postSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  day: { type: String, required: true }, // e.g. "2025-08-14" (YYYY-MM-DD)
  type: { type: String, enum: ["RFI","POST","UPDATE"], default: "POST" },
  content: { type: String, required: true },
  likes: { type: Number, default: 0 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  comments: { type: [commentSchema], default: [] }
},{ timestamps: true })

export default mongoose.model("Post", postSchema)
