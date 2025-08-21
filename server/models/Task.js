import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    title: { type: String, required: true },
    status: { type: String, default: "todo" },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    startDate: { type: Date, default: () => new Date() },
    endDate: { type: Date, default: () => new Date() },
    durationDays: { type: Number, default: 1 },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    barColor: { type: String },
    dependsOn: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    priority: { type: String },
    tags: [String],
  },
  { timestamps: true }
);

function dayDiff(a, b) {
  const MS = 1000 * 60 * 60 * 24;
  return Math.round((b.setUTCHours(0, 0, 0, 0) - a.setUTCHours(0, 0, 0, 0)) / MS) + 1;
}

// Ensure dates and duration stay in sync
taskSchema.pre("save", function (next) {
  if (this.startDate && this.endDate && this.startDate > this.endDate) {
    this.endDate = this.startDate;
  }
  if (this.isModified("startDate") || this.isModified("endDate")) {
    this.durationDays = dayDiff(new Date(this.startDate), new Date(this.endDate));
  }
  if (
    this.isModified("durationDays") &&
    !(this.isModified("startDate") || this.isModified("endDate"))
  ) {
    const ms = (this.durationDays - 1) * 24 * 60 * 60 * 1000;
    this.endDate = new Date(new Date(this.startDate).getTime() + ms);
  }
  next();
});

export default mongoose.model("Task", taskSchema);
