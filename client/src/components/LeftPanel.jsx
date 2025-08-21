export default function LeftPanel({ projects, selectedProjectId, onSelectProject, onOpenCreate }) {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm font-medium mb-1">Project</div>
        <select
          className="w-full border rounded-lg px-2 py-2 text-sm bg-white"
          value={selectedProjectId || ""}
          onChange={(e) => onSelectProject(e.target.value || null)}
        >
          {projects.length === 0 && <option value="">(none)</option>}
          {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
      </div>

      <button
        className="w-full px-3 py-2 text-sm rounded-lg border bg-slate-50 hover:bg-slate-100"
        onClick={onOpenCreate}
      >
        New Project
      </button>

      <div className="text-xs text-slate-500">
        Tips:
        <ul className="list-disc pl-4 mt-1 space-y-1">
          <li>Use <span className="font-mono">Prev/Next</span> or mouse wheel to scroll days</li>
          <li>Click <span className="font-mono">+</span> to add RFI/Post/Update</li>
          <li>Like & comment on items</li>
        </ul>
      </div>
    </div>
  )
}
