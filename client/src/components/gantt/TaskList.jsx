export default function TaskList({ tasks, selected, onSelect }) {
  return (
    <div className="divide-y">
      {tasks.map((t) => (
        <div
          key={t._id}
          className={`p-2 cursor-pointer ${
            selected === t._id ? "bg-gray-200" : ""
          }`}
          onClick={() => onSelect(t._id)}
        >
          <div className="font-medium">{t.title}</div>
          <div className="text-xs text-gray-500">
            {new Date(t.startDate).toLocaleDateString()} -{" "}
            {new Date(t.endDate).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}
