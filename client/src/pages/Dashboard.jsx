import { useState, useEffect } from "react";
import { listTasks, moveTask, resizeTask, updateProgress } from "../api/tasks";
import GanttToolbar from "../components/gantt/GanttToolbar";
import GanttCanvas from "../components/gantt/GanttCanvas";
import TaskList from "../components/gantt/TaskList";
import TaskEditor from "../components/gantt/TaskEditor";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [scale, setScale] = useState("week");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    listTasks().then((res) => setTasks(res.data));
  }, []);

  const handleMove = async (id, delta) => {
    setTasks((ts) =>
      ts.map((t) =>
        t._id === id
          ? {
              ...t,
              startDate: new Date(
                new Date(t.startDate).getTime() + delta * 86400000
              ).toISOString(),
              endDate: new Date(
                new Date(t.endDate).getTime() + delta * 86400000
              ).toISOString(),
            }
          : t
      )
    );
    try {
      await moveTask(id, delta);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async (form) => {
    const id = selected;
    const res = await resizeTask(id, {
      endDate: form.endDate,
      durationDays: form.durationDays,
    });
    await updateProgress(id, form.progress);
    setTasks((ts) => ts.map((t) => (t._id === id ? res.data : t)));
  };

  return (
    <div className="flex h-full">
      <div className="w-1/4 border-r overflow-y-auto">
        <TaskList tasks={tasks} selected={selected} onSelect={setSelected} />
        <TaskEditor
          task={tasks.find((t) => t._id === selected)}
          onSave={handleSave}
        />
      </div>
      <div className="flex-1 flex flex-col">
        <GanttToolbar scale={scale} setScale={setScale} onToday={() => {}} />
        <GanttCanvas tasks={tasks} scale={scale} onMove={handleMove} />
      </div>
    </div>
  );
}
