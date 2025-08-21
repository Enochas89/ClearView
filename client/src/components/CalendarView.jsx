import { useEffect, useMemo, useRef, useState } from "react"
import { listPosts, likePost, addComment } from "../api/posts"
import PostComposer from "./PostComposer"

const fmt = (d) => d.toISOString().slice(0,10) // YYYY-MM-DD
const isMongoId = (s) => typeof s === "string" && /^[a-fA-F0-9]{24}$/.test(s)

function Icon({ type }) {
  const map = {
    RFI:    { char: "▲", label: "RFI",    className: "text-orange-500" },
    POST:   { char: "●", label: "Post",   className: "text-green-600" },
    UPDATE: { char: "■", label: "Update", className: "text-blue-600" }
  }
  const i = map[type] || map.POST
  return <span className={`mr-2 ${i.className}`}>{i.char}</span>
}

export default function CalendarView({ projectId }) {
  const today = new Date()
  const todayKey = fmt(today)
  const containerRef = useRef(null)
  const validProject = isMongoId(projectId)

  // 4 weeks window (prev 1, next 3)
  const days = useMemo(() => {
    const out = []
    for (let i = -7; i <= 21; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      out.push(d)
    }
    return out
  }, [today])

  // UI state
  const [posts, setPosts] = useState([])
  const [openComposer, setOpenComposer] = useState(false)
  const [composerDay, setComposerDay] = useState(todayKey)
  const [commentText, setCommentText] = useState({})

  // Fetch & group
  const grouped = useMemo(() => {
    const g = {}
    for (const p of posts) {
      const day = p.day || (p.createdAt ? p.createdAt.slice(0,10) : "")
      if (!g[day]) g[day] = []
      g[day].push(p)
    }
    return g
  }, [posts])

  const refresh = async () => {
    if (!validProject) { setPosts([]); return }
    const { data } = await listPosts(projectId)
    setPosts(data)
  }
  useEffect(() => { refresh() }, [projectId])

  // Toolbar actions
  const scrollByTiles = (delta = 1) => {
    const el = containerRef.current
    if (!el) return
    const tileWidth = 272 // min-w 260 + gap
    el.scrollLeft += tileWidth * delta
  }
  const scrollToToday = () => {
    const el = document.getElementById(`day-${todayKey}`)
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
  }
  const openForDay = (day) => {
    if (!validProject) return
    setComposerDay(day)
    setOpenComposer(true)
  }
  const onLike = async (id) => {
    const { data } = await likePost(id)
    setPosts(prev => prev.map(p => p._id === id ? data : p))
  }
  const onAddComment = async (id) => {
    const text = (commentText[id] || "").trim()
    if (!text) return
    const { data } = await addComment(id, text)
    setCommentText({ ...commentText, [id]: "" })
    setPosts(prev => prev.map(p => p._id === id ? data : p))
  }

  return (
    <div className="h-[70vh] flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 text-sm rounded-lg border bg-white hover:bg-slate-50" onClick={() => scrollByTiles(-3)}>←</button>
          <button className="px-3 py-2 text-sm rounded-lg border bg-white hover:bg-slate-50" onClick={scrollToToday}>Today</button>
          <button className="px-3 py-2 text-sm rounded-lg border bg-white hover:bg-slate-50" onClick={() => scrollByTiles(3)}>→</button>
          <div className="ml-3 hidden md:flex items-center text-xs text-slate-600 gap-3">
            <span className="flex items-center"><span className="text-orange-500 mr-1">▲</span>RFI</span>
            <span className="flex items-center"><span className="text-green-600 mr-1">●</span>Post</span>
            <span className="flex items-center"><span className="text-blue-600 mr-1">■</span>Update</span>
          </div>
        </div>
        <div className="text-xs text-slate-600">
          {validProject ? "Scroll with mouse wheel or arrows" : <span className="text-red-600">Select or create a project</span>}
        </div>
      </div>

      {/* Day strip (shorter cards ~ half panel height) */}
      <div
        ref={containerRef}
        className="overflow-x-auto whitespace-nowrap rounded-lg border bg-slate-50"
        onWheel={(e) => { e.currentTarget.scrollLeft += e.deltaY }}
        style={{ scrollBehavior: "smooth" }}
      >
        <div className="inline-flex gap-3 p-3">
          {days.map((d, idx) => {
            const key = fmt(d)
            const isToday = key === todayKey
            const items = grouped[key] || []

            return (
              <div
                key={idx}
                id={`day-${key}`}
                className={`min-w-[260px] h-[32vh] bg-white border rounded-xl shadow-sm p-2 relative flex flex-col`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-600">
                    <span className="font-semibold">{d.toLocaleDateString(undefined, { weekday: "short" })}</span>{" "}
                    {d.toLocaleDateString()}
                  </div>
                  <button
                    title={validProject ? "Add" : "Select a project first"}
                    className={`w-8 h-8 rounded-full border ${validProject ? "hover:bg-slate-50" : "opacity-50 cursor-not-allowed"}`}
                    onClick={() => validProject && openForDay(key)}
                    disabled={!validProject}
                  >
                    +
                  </button>
                </div>

                {isToday && <div className="mt-1 h-0.5 bg-blue-200 rounded"></div>}

                <div className="mt-2 flex-1 overflow-auto pr-1">
                  {items.length === 0 ? (
                    <div className="text-xs text-slate-400 mt-2">No posts</div>
                  ) : items.map(p => (
                    <div key={p._id} className="border rounded-lg p-2 mb-2 hover:shadow-sm">
                      <div className="flex items-start">
                        <Icon type={p.type} />
                        <div className="flex-1">
                          <div className="text-sm">{p.content}</div>
                          <div className="mt-1 text-[11px] text-slate-500">
                            {p.type} • {new Date(p.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        <button className="text-xs px-2 py-1 rounded border hover:bg-slate-50" onClick={() => onLike(p._id)}>
                          Like ({p.likes || 0})
                        </button>
                      </div>

                      <div className="mt-2 space-y-1">
                        {(p.comments || []).map((c, i) => (
                          <div key={i} className="text-xs text-slate-700 bg-slate-50 rounded px-2 py-1">{c.text}</div>
                        ))}
                        <div className="flex gap-1">
                          <input
                            className="flex-1 border rounded px-2 py-1 text-xs"
                            placeholder="Add a comment…"
                            value={(commentText[p._id] || "")}
                            onChange={(e)=>setCommentText({...commentText, [p._id]: e.target.value})}
                          />
                          <button className="text-xs px-2 py-1 rounded border bg-slate-50 hover:bg-slate-100" onClick={() => onAddComment(p._id)}>
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Composer modal */}
      <PostComposer
        open={openComposer}
        onClose={()=>setOpenComposer(false)}
        projectId={validProject ? projectId : null}
        day={composerDay}
        onCreated={refresh}
      />
    </div>
  )
}
