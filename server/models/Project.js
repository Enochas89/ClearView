import mongoose from "mongoose"

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },

  // Custom, human-friendly ID (what you type in the UI)
  projectId: { type: String, required: true, unique: true, index: true, trim: true },

  address: { type: String, default: "" },
  startDate: { type: Date, default: null },
  endDate: { type: Date, default: null },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true })

export default mongoose.model("Project", projectSchema)
