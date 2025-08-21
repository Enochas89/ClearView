export default function ProjectHeader({ project }) {
  if (!project) return null
  const fmt = (v) => v ? new Date(v).toLocaleDateString() : "—"

  return (
    <div className="rounded-lg border bg-slate-50 px-3 py-2 mb-3">
      <div className="text-sm font-semibold">{project.name}</div>
      <div className="text-xs text-slate-600">
        ID: <span className="font-mono">{project.projectId || "—"}</span> &nbsp;•&nbsp;
        {fmt(project.startDate)} → {fmt(project.endDate)} &nbsp;•&nbsp;
        {project.address || "No address"}
      </div>
    </div>
  )
}
