import { useState, useMemo } from "react";

export default function TaskList({ tasks, selected, onSelect }) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [assignee, setAssignee] = useState("");

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const matchesText = t.title.toLowerCase().includes(text.toLowerCase());
      const matchesStatus = status ? t.status === status : true;
      const matchesAssignee = assignee ? t.assignee === assignee : true;
      return matchesText && matchesStatus && matchesAssignee;
    });
  }, [tasks, text, status, assignee]);

  const grouped = useMemo(() => {
    const g = {};
    for (const t of filtered) {
      g[t.status] = g[t.status] || [];
      g[t.status].push(t);
    }
    return g;
  }, [filtered]);

  return (
    <div className="p-2 space-y-2 border-b">
        <input
          type="text"
          placeholder="Search..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border px-2 py-1 text-sm"
        />
        <div className="flex space-x-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border px-2 py-1 text-sm flex-1"
          >
            <option value="">All Statuses</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <input
            type="text"
            placeholder="Assignee"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="border px-2 py-1 text-sm flex-1"
          />
        </div>
      </div>
      {Object.keys(grouped).map((s) => (
        <div key={s} className="border-b">
          <div className="px-2 py-1 text-xs font-semibold bg-gray-100">{s}</div>
          {grouped[s].map((t) => (
            <div
              key={t._id}
              className={`p-2 cursor-pointer ${
                selected === t._id ? "bg-gray-200" : ""
              }`}
              onClick={() => onSelect(t._id)}
            >
              <div className="flex justify-between text-sm">
                <span>{t.title}</span>
                <span>{t.progress}%</span>
              </div>
              <div className="text-xs text-gray-500">
                {new Date(t.startDate).toLocaleDateString()} - {" "}
                {new Date(t.endDate).toLocaleDateString()} ({t.durationDays}d)
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}