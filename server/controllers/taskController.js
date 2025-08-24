import Task from "../models/Task.js";

export async function list(req, res) {
  const { projectId, from, to } = req.query;
  const q = projectId ? { project: projectId } : {};
  if (from || to) {
    q.startDate = {};
    if (from) q.startDate.$gte = new Date(from);
    if (to) q.startDate.$lte = new Date(to);
  }
  const tasks = await Task.find(q);
  res.json(tasks);
}

export async function create(req, res) {
  const t = await Task.create(req.body);
  res.json(t);
}
export async function update(req, res) {
  const t = await Task.findById(req.params.id);
  if (!t) return res.sendStatus(404);
  const fields = [
    "title",
    "startDate",
    "endDate",
    "durationDays",
    "progress",
    "status",
    "assignee",
    "barColor",
    "dependsOn",
    "priority",
    "tags",
  ];
  for (const f of fields) {
    if (req.body[f] !== undefined) t[f] = req.body[f];
  }
  await t.save();
  res.json(t);
}


export async function move(req, res) {
  const { deltaDays } = req.body;
  const t = await Task.findById(req.params.id);
  if (!t) return res.sendStatus(404);
  const ms = deltaDays * 24 * 60 * 60 * 1000;
  t.startDate = new Date(new Date(t.startDate).getTime() + ms);
  t.endDate = new Date(new Date(t.endDate).getTime() + ms);
  await t.save();
  res.json(t);
}

export async function resize(req, res) {
  const { endDate, durationDays } = req.body;
  const t = await Task.findById(req.params.id);
  if (!t) return res.sendStatus(404);
  if (endDate) t.endDate = new Date(endDate);
  if (durationDays) t.durationDays = durationDays;
  await t.save();
  res.json(t);
}

export async function progress(req, res) {
  const { progress } = req.body;
  const t = await Task.findByIdAndUpdate(
    req.params.id,
    { progress },
    { new: true }
  );
  if (!t) return res.sendStatus(404);
  res.json(t);
}
