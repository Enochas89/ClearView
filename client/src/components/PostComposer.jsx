import { useState } from "react"
import { createPost } from "../api/posts"

export default function PostComposer({ open, onClose, projectId, day, onCreated }) {
  const [type, setType] = useState("POST")
  const [content, setContent] = useState("")

  if (!open) return null

  const submit = async () => {
    if (!content.trim()) return
    await createPost({ project: projectId, day, type, content })
    setContent("")
    setType("POST")
    onCreated?.()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-full max-w-md rounded-xl bg-white p-4 shadow">
        <div className="text-lg font-semibold mb-2">New {type} for {day}</div>

        <div className="mb-3">
          <label className="text-sm mr-2">Type:</label>
          <select className="border rounded px-2 py-1 text-sm" value={type} onChange={e=>setType(e.target.value)}>
            <option value="RFI">RFI</option>
            <option value="POST">Post</option>
            <option value="UPDATE">Update</option>
          </select>
        </div>

        <textarea
          rows={4}
          className="w-full border rounded-lg px-2 py-2 text-sm"
          placeholder="Write something…"
          value={content}
          onChange={e=>setContent(e.target.value)}
        />

        <div className="mt-3 flex justify-end gap-2">
          <button className="px-3 py-2 text-sm rounded-lg border" onClick={onClose}>Cancel</button>
          <button className="px-3 py-2 text-sm rounded-lg border bg-blue-600 text-white" onClick={submit}>Post</button>
        </div>
      </div>
    </div>
  )
}
