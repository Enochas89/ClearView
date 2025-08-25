import { useState } from "react";
import { createTask } from "../../api/tasks";

export default function TaskCreate({ onCreated }) {
  const today = new Date().toISOString().slice(0, 10);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    startDate: today,
    durationDays: 1,
    assignee: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return;
      const { data } = await createTask({
      ...form,
      endDate: new Date(
        new Date(form.startDate).getTime() + (form.durationDays - 1) * 86400000
      )
        .toISOString()
        .slice(0, 10),
    });
    onCreated?.(data);
      setForm({ title: "", startDate: today, durationDays: 1, assignee: "" });
    setOpen(false);
  };

  if (!open)
    return (
      <button
        type="button"
        className="m-2 px-2 py-1 text-sm bg-blue-500 text-white rounded"
        onClick={() => setOpen(true)}
      >
        + Task
      </button>
    );

  return (
    <form onSubmit={handleSubmit} className="space-y-2 p-2 border-b">
      <div className="font-medium">New Task</div>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Task title"
        className="w-full border px-2 py-1 text-sm"
        required
      />
      <div className="flex space-x-2">
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          className="w-full border px-2 py-1 text-sm flex-1"
        />
        <input
          type="number"
          name="durationDays"
          value={form.durationDays}
          onChange={handleChange}
          className="w-full border px-2 py-1 text-sm flex-1"
        />
      </div>
      <input
        type="text"
        name="assignee"
        value={form.assignee}
        onChange={handleChange}
        placeholder="Assignee"
        className="w-full border px-2 py-1 text-sm"
      />
         <div className="flex space-x-2">
        <button
          type="submit"
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded flex-1"
        >
          Save
        </button>
        <button
          type="button"
          className="px-3 py-1 text-sm bg-gray-200 rounded flex-1"
          onClick={() => setOpen(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}