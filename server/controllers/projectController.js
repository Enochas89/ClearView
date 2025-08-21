import Project from "../models/Project.js"

const validProjectId = (s) => typeof s === "string" && /^[A-Za-z0-9_-]{2,32}$/.test(s)

export async function list(req, res) {
  const projects = await Project.find({ members: req.user.id }).sort({ createdAt: -1 })
  res.json(projects)
}

export async function create(req, res) {
  try {
    const { name, projectId, address, startDate, endDate } = req.body

    if (!name?.trim()) return res.status(400).json({ message: "Project name is required" })
    if (!projectId?.trim()) return res.status(400).json({ message: "projectId is required" })
    if (!validProjectId(projectId)) {
      return res.status(400).json({ message: "Invalid projectId. Use 2–32 chars: letters, numbers, _ or -" })
    }

    const pid = projectId.trim()
    const exists = await Project.findOne({ projectId: pid })
    if (exists) return res.status(409).json({ message: "projectId already exists" })

    const p = await Project.create({
      name: name.trim(),
      projectId: pid,
      address: address?.trim() || "",
      startDate: startDate || null,
      endDate: endDate || null,
      members: [req.user.id]
    })
    res.json(p)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to create project" })
  }
}

// GET /api/projects/exists?projectId=ABC
export async function exists(req, res) {
  const pid = (req.query.projectId || "").trim()
  if (!pid) return res.status(400).json({ message: "projectId query is required" })
  if (!validProjectId(pid)) return res.status(400).json({ message: "Invalid projectId format" })
  const found = await Project.exists({ projectId: pid })
  res.json({ exists: !!found })
}
