import { useState } from "react";
import useGanttScale from "../../hooks/useGanttScale";

export default function GanttCanvas({ tasks, scale, onMove, onResize, onProgress }) {
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

  const handleProgressDown = (task, width, e) => {
    e.stopPropagation();
    setDrag({
      id: task._id,
      startX: e.clientX,
      mode: "progress",
      width,
      startProgress: task.progress || 0,
    });
  };

  const handleMove = (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    if (drag.mode === "progress") {
      const pct = Math.min(
        100,
        Math.max(
          0,
          drag.startProgress + Math.round((dx / drag.width) * 100)
        )
      );
      onProgress?.(drag.id, pct);
      return;
    }
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
                <div
                  className="h-full bg-blue-700 opacity-50"
                  style={{ width: `${t.progress || 0}%` }}
                />
                <div
                  className="absolute top-0 left-0 w-full h-full flex items-center px-1 pointer-events-none"
                >
                  {t.title}
                </div>
                <div
                  className="absolute top-0 right-0 w-1 h-full cursor-ew-resize bg-blue-700"
                  onMouseDown={(e) => handleResizeDown(t, e)}
                />
                <div
                  className="absolute top-0"
                  style={{ left: `${t.progress || 0}%` }}
                >
                  <div
                    className="w-2 h-full cursor-ew-resize bg-green-500"
                    onMouseDown={(e) => handleProgressDown(t, w, e)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
