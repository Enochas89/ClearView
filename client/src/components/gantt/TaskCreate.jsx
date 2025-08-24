import { useState } from "react";
import { createTask } from "../../api/tasks";

export default function TaskCreate({ onCreated }) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    title: "",
    startDate: today,
    endDate: today,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return;
    const { data } = await createTask(form);
    onCreated?.(data);
    setForm({ title: "", startDate: today, endDate: today });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 p-2 border-b">
      <div className="font-medium">Create Task</div>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Task title"
        className="w-full border px-2 py-1 text-sm"
      />
      <input
        type="date"
        name="startDate"
        value={form.startDate}
        onChange={handleChange}
        className="w-full border px-2 py-1 text-sm"
      />
      <input
        type="date"
        name="endDate"
        value={form.endDate}
        onChange={handleChange}
        className="w-full border px-2 py-1 text-sm"
      />
      <button
        type="submit"
        className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
      >
        Add Task
      </button>
    </form>
  );
}