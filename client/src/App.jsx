import { useEffect, useMemo, useState } from "react"
import LeftPanel from "./components/LeftPanel.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import ProjectCreate from "./components/ProjectCreate.jsx"
import { listProjects } from "./api/projects"

function ProjectHeader({ project }) {
  if (!project) return null
  const fmt = (v) => v ? new Date(v).toLocaleDateString() : "—"
  return (
    <div className="rounded-lg border bg-slate-50 px-3 py-2 mb-3">
      <div className="text-sm font-semibold">{project.name}</div>
      <div className="text-xs text-slate-600 space-x-2">
        <span>Custom ID: <span className="font-mono">{project.projectId || "—"}</span></span>
        <span>•</span>
        <span>{fmt(project.startDate)} → {fmt(project.endDate)}</span>
        <span>•</span>
        <span>{project.address || "No address"}</span>
      </div>
    </div>
  )
}

export default function App() {
  const [projects, setProjects] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [error, setError] = useState("")
  const [showCreate, setShowCreate] = useState(false)

  const selectedProject = useMemo(
    () => projects.find(p => p._id === selectedProjectId) || null,
    [projects, selectedProjectId]
  )

  const refreshProjects = async () => {
    try {
      const { data } = await listProjects()
      setProjects(data)
      if (!selectedProjectId && data.length) setSelectedProjectId(data[0]._id)
      setError("")
    } catch (e) {
      console.error("listProjects failed:", e?.response?.data || e.message)
      setProjects([])
      setError("Failed to load projects.")
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      setError("Login required to view projects.")
      if (typeof window !== "undefined" && window.location.pathname !== "/auth") {
        window.location.href = "/auth"
      }
      return
    }
    refreshProjects()
  }, [])

  const onProjectCreated = async (newProj) => {
    setSelectedProjectId(newProj?._id || null)
    await refreshProjects()
  }

  return (
    <div className="min-h-screen text-slate-800 bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-screen-2xl px-4 py-3 flex items-center justify-between">
          <div className="text-xl font-semibold tracking-tight">Project Manager</div>
          <div className="text-xs text-slate-500">React + Vite + Tailwind</div>
        </div>
      </header>

      <main className="mx-auto max-w-screen-2xl p-4">
        {error && (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-[280px,1fr] gap-4">
          <aside className="rounded-xl border bg-white p-3">
            <LeftPanel
              projects={projects}
              selectedProjectId={selectedProjectId}
              onSelectProject={setSelectedProjectId}
              onOpenCreate={() => setShowCreate(true)}
            />
          </aside>

          <section className="rounded-xl border bg-white p-3 overflow-hidden">
            {selectedProject && <ProjectHeader project={selectedProject} />}
            {selectedProjectId ? (
              <Dashboard />
            ) : (
              <div className="text-sm text-slate-500 p-2">
                Create or select a project to begin.
              </div>
            )}
          </section>
        </div>
      </main>

      <ProjectCreate
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={onProjectCreated}
      />
    </div>
  )
}
