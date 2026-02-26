import { useState, useEffect } from "react";
import { CheckCircle2, Circle, TrendingUp } from "lucide-react";

interface RoutineItem {
  id: string;
  label: string;
  done: boolean;
}

const defaultItems: RoutineItem[] = [
  { id: "1", label: "Morning Pages", done: false },
  { id: "2", label: "Exercise (30 min)", done: false },
  { id: "3", label: "Meditate", done: false },
  { id: "4", label: "Read for 20 min", done: false },
  { id: "5", label: "Review goals", done: false },
  { id: "6", label: "Plan tomorrow", done: false },
];

export default function DailyRoutineCard() {
  const [items, setItems] = useState<RoutineItem[]>(() => {
    const saved = localStorage.getItem("dailyRoutine");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Reset if it's a new day
      const lastDate = localStorage.getItem("dailyRoutineDate");
      const today = new Date().toDateString();
      if (lastDate !== today) {
        localStorage.setItem("dailyRoutineDate", today);
        return defaultItems;
      }
      return parsed;
    }
    localStorage.setItem("dailyRoutineDate", new Date().toDateString());
    return defaultItems;
  });

  useEffect(() => {
    localStorage.setItem("dailyRoutine", JSON.stringify(items));
  }, [items]);

  const toggle = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i))
    );
  };

  const doneCount = items.filter((i) => i.done).length;
  const pct = Math.round((doneCount / items.length) * 100);

  return (
    <div className="dashboard-card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">Daily Routine</h3>
        <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
          <TrendingUp className="w-4 h-4" />
          {pct}% Done
        </div>
      </div>

      <div className="progress-bar mb-4">
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>

      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => toggle(item.id)}
              className="flex items-center gap-3 w-full text-left py-1.5 px-2 rounded-lg hover:bg-muted transition-colors"
            >
              {item.done ? (
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              )}
              <span
                className={`text-sm ${
                  item.done
                    ? "line-through text-muted-foreground"
                    : "text-foreground"
                }`}
              >
                {item.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
