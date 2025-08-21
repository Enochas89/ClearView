import { useState } from "react";
import useGanttScale from "../../hooks/useGanttScale";

export default function GanttCanvas({ tasks, scale, onMove }) {
  const { unit, dateToX, widthFor, snap } = useGanttScale(scale);
  const [drag, setDrag] = useState(null);
  const origin = tasks[0]?.startDate || new Date();

  const handleDown = (task, e) => {
    setDrag({ id: task._id, startX: e.clientX });
  };

  const handleMove = (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    const delta = snap(dx);
    onMove(drag.id, delta);
  };

  const handleUp = () => setDrag(null);

  return (
    <div
      className="relative overflow-x-auto"
      onMouseMove={handleMove}
      onMouseUp={handleUp}
    >
      <div className="relative" style={{ height: tasks.length * 32 }}>
        {tasks.map((t, i) => {
          const x = dateToX(origin, t.startDate);
          const w = widthFor(t.durationDays);
          return (
            <div
              key={t._id}
              className="absolute bg-blue-500 text-white text-xs cursor-move"
              style={{ left: x, top: i * 32, width: w, height: 24 }}
              onMouseDown={(e) => handleDown(t, e)}
            >
              {t.title}
            </div>
          );
        })}
      </div>
    </div>
  );
}
