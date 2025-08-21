import { useMemo, useState } from "react"
import { createProject } from "../api/projects"

const isValidProjectId = (s) => /^[A-Za-z0-9_-]{2,32}$/.test(s || "")

export default function ProjectCreate({ open, onClose, onCreated }) {
  const today = useMemo(() => new Date(), [])
  const toYMD = (d) => d.toISOString().slice(0, 10)

  const [name, setName] = useState("")
  const [projectId, setProjectId] = useState(() => `P-${Math.floor(Math.random()*10000).toString().padStart(4,"0")}`)
  const [address, setAddress] = useState("")
  const [startDate, setStartDate] = useState(toYMD(today))
  const [endDate, setEndDate] = useState(toYMD(new Date(today.getTime() + 14*864e5)))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  if (!open) return null

  const submit = async () => {
    try {
      setError("")
      const nm = name.trim()
      const pid = projectId.trim()
      if (!nm) return setError("Project name is required.")
      if (!pid) return setError("Custom Project ID is required.")
      if (!isValidProjectId(pid)) return setError("Use 2–32 chars: letters, numbers, _ or -.")
      if (new Date(startDate) > new Date(endDate)) return setError("Start date must be before end date.")

      setSaving(true)
      const payload = {
        name: nm,
        projectId: pid,
        address: address.trim(),
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString()
      }
      const res = await createProject(payload)
      setSaving(false)

      setName("")
      setProjectId(`P-${Math.floor(Math.random()*10000).toString().padStart(4,"0")}`)
      setAddress("")
      onCreated?.(res.data)
      onClose()
    } catch (e) {
      setSaving(false)
      const msg = e?.response?.data?.message || e.message || "Failed to create project."
      setError(msg)
      alert("Create Project Error: " + msg)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-lg">
        <div className="text-lg font-semibold mb-3">New Project</div>

        {error && (
          <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs text-slate-600 mb-1">Project Name *</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g., ClearView Alpha" />
          </div>

          <div className="col-span-2">
            <label className="block text-xs text-slate-600 mb-1">Custom Project ID *</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm font-mono" value={projectId} onChange={e=>setProjectId(e.target.value)} placeholder="JOB-1001 or P_2025-01" />
            <div className="text-xs text-slate-500 mt-1">Letters, numbers, underscore _, or dash - (2–32 chars)</div>
          </div>

          <div>
            <label className="block text-xs text-slate-600 mb-1">Address</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" value={address} onChange={e=>setAddress(e.target.value)} placeholder="Optional" />
          </div>

          <div>
            <label className="block text-xs text-slate-600 mb-1">Start Date</label>
            <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm" value={startDate} onChange={e=>setStartDate(e.target.value)} />
          </div>

          <div>
            <label className="block text-xs text-slate-600 mb-1">End Date</label>
            <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm" value={endDate} onChange={e=>setEndDate(e.target.value)} />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button className="px-3 py-2 text-sm rounded-lg border" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="px-3 py-2 text-sm rounded-lg border bg-blue-600 text-white disabled:opacity-60" onClick={submit} disabled={saving}>
            {saving ? "Creating..." : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  )
}
