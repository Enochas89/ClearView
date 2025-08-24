import { useState, useEffect, useCallback } from "react";
import {
  listTasks,
  moveTask,
  updateTask,
} from "../api/tasks";
import GanttToolbar from "../components/gantt/GanttToolbar";
import GanttCanvas from "../components/gantt/GanttCanvas";
import TaskList from "../components/gantt/TaskList";
import TaskEditor from "../components/gantt/TaskEditor";
export default function Dashboard({ onRegisterCreate }) {
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
   if (!selected) return;
    const res = await updateTask(selected, {
      title: form.title,
      startDate: form.startDate,
      endDate: form.endDate,
      durationDays: form.durationDays,
       progress: form.progress,
    });
   setTasks((ts) => ts.map((t) => (t._id === selected ? res.data : t)));
  };

  const handleCreated = (task) => {
      setTasks((ts) => [...ts, task]);
    setSelected(task._id);
    }, []);

  useEffect(() => {
    onRegisterCreate?.(handleCreated);
  }, [onRegisterCreate, handleCreated]);

  return (
    <div className="flex h-full">
        <div className="w-1/4 border-r overflow-y-auto">
        <TaskList
          tasks={tasks}
          selected={selected}
          onSelect={setSelected}
        />
      </div>
      <div className="flex-1 flex flex-col">
         <div className="flex-1 overflow-y-auto border-b">
          <TaskEditor
            task={tasks.find((t) => t._id === selected)}
            onSave={handleSave}
          />
        </div>
        <div className="flex-1 flex flex-col">
          <GanttToolbar scale={scale} setScale={setScale} onToday={() => {}} />
          <div className="flex-1">
            <GanttCanvas tasks={tasks} scale={scale} onMove={handleMove} />
          </div>
        </div>
      </div>
    </div>
  );
}