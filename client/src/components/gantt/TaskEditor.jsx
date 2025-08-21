import { useState, useEffect } from "react";

export default function TaskEditor({ task, onSave }) {
  const [form, setForm] = useState({
    title: "",
    startDate: "",
    endDate: "",
    durationDays: 1,
    progress: 0,
  });

  useEffect(() => {
    if (task)
      setForm({
        title: task.title,
        startDate: task.startDate?.substring(0, 10),
        endDate: task.endDate?.substring(0, 10),
        durationDays: task.durationDays,
        progress: task.progress,
      });
  }, [task]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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
      <input
        type="range"
        name="progress"
        min="0"
        max="100"
        value={form.progress}
        onChange={handleChange}
        className="w-full"
      />
      <button className="px-2 py-1 bg-blue-500 text-white" type="submit">
        Save
      </button>
    </form>
  );
}
