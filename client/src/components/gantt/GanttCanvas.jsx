import { useState } from "react";
import useGanttScale from "../../hooks/useGanttScale";

export default function GanttCanvas({ tasks, scale, onMove, onResize }) {
  const { unit, dateToX, widthFor, snap } = useGanttScale(scale);
  const [drag, setDrag] = useState(null);
  const origin = tasks[0]?.startDate || new Date();

  const handleDown = (task, e) => {
    setDrag({ id: task._id, startX: e.clientX, mode: "move" });
  };

  const handleResizeDown = (task, e) => {
    e.stopPropagation();
    setDrag({ id: task._id, startX: e.clientX, mode: "resize" });
  };

  const handleMove = (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    const delta = snap(dx);
    if (delta === 0) return;
    if (drag.mode === "resize") {
      onResize?.(drag.id, delta);
      setDrag({ ...drag, startX: e.clientX });
    } else {
      onMove(drag.id, delta);
      setDrag({ ...drag, startX: e.clientX });
    }
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
              className="absolute bg-blue-500 text-white text-xs"
              style={{ left: x, top: i * 32, width: w, height: 24 }}
            >
              <div
                className="w-full h-full cursor-move relative"
                onMouseDown={(e) => handleDown(t, e)}
              >
                {t.title}
                <div
                  className="absolute top-0 right-0 w-1 h-full cursor-ew-resize bg-blue-700"
                  onMouseDown={(e) => handleResizeDown(t, e)}
                />
              </div>
            </div>
          );
        }}
      </div>
    </div>
  );
}
