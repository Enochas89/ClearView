import { useState, useEffect } from "react";

export default function TaskEditor({ task, onSave, onDelete, onDuplicate }) {
  const [form, setForm] = useState({
    title: "",
    assignee: "",
    status: "todo",
    startDate: "",
    endDate: "",
    durationDays: 1,
    progress: 0,
  });

  useEffect(() => {
    if (task)
      setForm({
        title: task.title,
        assignee: task.assignee || "",
        status: task.status || "todo",
        startDate: task.startDate?.substring(0, 10),
        endDate: task.endDate?.substring(0, 10),
        durationDays: task.durationDays,
        progress: task.progress,
      });
  }, [task]);

    const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "startDate" || name === "endDate") {
      const updated = { ...form, [name]: value };
      if (updated.startDate && updated.endDate) {
        const s = new Date(updated.startDate);
        const eDate = new Date(updated.endDate);
        updated.durationDays =
          Math.round((eDate - s) / (1000 * 60 * 60 * 24)) + 1;
      }
      setForm(updated);
    } else if (name === "durationDays") {
      const s = new Date(form.startDate);
      const d = parseInt(value, 10) || 1;
      const end = new Date(s.getTime() + (d - 1) * 86400000);
      setForm({ ...form, durationDays: d, endDate: end.toISOString().slice(0, 10) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  if (!task) return <div className="p-4 text-gray-500">Select a task</div>;

  return (
    <form
      className="p-2 space-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
    >
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        className="w-full border p-1"
      />
      <div className="flex space-x-2">
        <input
          type="text"
          name="assignee"
          placeholder="Assignee"
          value={form.assignee}
          onChange={handleChange}
          className="border p-1 flex-1"
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border p-1 flex-1"
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      <div className="flex space-x-2">
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          className="border p-1 flex-1"
        />
        <input
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          className="border p-1 flex-1"
        />
      </div>
      <input
        type="number"
        name="durationDays"
        value={form.durationDays}
        onChange={handleChange}
        className="w-full border p-1"
      />
        <div>
        <input
          type="range"
          name="progress"
          min="0"
          max="100"
          value={form.progress}
          onChange={handleChange}
          className="w-full"
        />
        <div className="text-xs text-right">{form.progress}%</div>
      </div>
      <div className="flex space-x-2">
        <button
          className="px-2 py-1 bg-blue-500 text-white flex-1"
          type="submit"
        >
          Save
        </button>
        <button
          type="button"
          className="px-2 py-1 bg-gray-200 flex-1"
          onClick={() => onDelete?.(task._id)}
        >
          Delete
        </button>
        <button
          type="button"
          className="px-2 py-1 bg-gray-200 flex-1"
          onClick={() => onDuplicate?.(task._id)}
        >
          Duplicate
        </button>
      </div>
    </form>
  );
}