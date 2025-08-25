export default function GanttToolbar({ scale, setScale, onToday, showDeps, setShowDeps}) {
  return (
    <div className="flex items-center space-x-2 p-2 border-b">
      <button
        className={scale === "day" ? "font-bold" : ""}
        onClick={() => setScale("day")}
      >
        Day
      </button>
      <button
        className={scale === "week" ? "font-bold" : ""}
        onClick={() => setScale("week")}
      >
        Week
      </button>
      <button
        className={scale === "month" ? "font-bold" : ""}
        onClick={() => setScale("month")}
      >
        Month
      </button>
      <button onClick={onToday} className="ml-auto px-2 py-1 bg-gray-200">
        Today
      </button>
        <button
        type="button"
        onClick={() => setShowDeps?.(!showDeps)}
        className={`px-2 py-1 ${showDeps ? "font-bold" : ""}`}
      >
        {showDeps ? "Hide" : "Show"} deps
      </button>
    </div>
  );
}
