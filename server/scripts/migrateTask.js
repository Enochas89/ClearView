import mongoose from "mongoose";
import dotenv from "dotenv";
import Task from "../models/Task.js";

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const tasks = await Task.find();
  for (const t of tasks) {
    if (!t.startDate) t.startDate = new Date();
    if (!t.endDate) t.endDate = t.startDate;
    if (!t.durationDays) t.durationDays = 1;
    if (t.progress === undefined) t.progress = 0;
    await t.save();
  }
  console.log(`Migrated ${tasks.length} tasks`);
  process.exit();
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
