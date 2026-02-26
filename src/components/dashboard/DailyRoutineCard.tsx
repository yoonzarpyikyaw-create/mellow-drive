import { useState } from "react";
import { Plus, CheckCircle2, Circle, TrendingUp, Trash2, Edit3, X } from "lucide-react";
import { useTodos } from "@/hooks/useTodos";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

export default function DailyRoutineCard() {
  const { todos, toggle, addTodo, removeTodo, todayTodos, pct } = useTodos();
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState("");
  const [filter, setFilter] = useState<"today" | "all">("today");

  const displayed = filter === "today" ? todayTodos : todos.filter((t) => !t.done).slice(0, 6);

  const handleAdd = () => {
    if (!newText.trim()) return;
    addTodo(newText, "medium", "Routine");
    toast({ title: "Task added", description: newText });
    setNewText("");
    setAdding(false);
  };

  return (
    <div className="dashboard-card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">Daily Routine</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
            <TrendingUp className="w-4 h-4" />
            {pct}%
          </div>
          <button
            onClick={() => setAdding(true)}
            className="text-primary hover:text-primary/80 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="progress-bar mb-3">
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>

      {/* Filter tabs */}
      <div className="flex bg-muted rounded-lg p-0.5 mb-3">
        {(["today", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 px-3 py-1 text-xs font-medium rounded-md capitalize transition-colors ${
              filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f === "today" ? "Today" : "All Tasks"}
          </button>
        ))}
      </div>

      {/* Quick add */}
      {adding && (
        <div className="flex gap-2 mb-3">
          <input
            className="flex-1 bg-muted border-none rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Add a task..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            autoFocus
          />
          <button onClick={handleAdd} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Add</button>
          <button onClick={() => setAdding(false)} className="px-2 py-2 text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <ul className="space-y-1.5">
        {displayed.map((item) => (
          <li key={item.id} className="group">
            <div className="flex items-center gap-3 w-full py-1.5 px-2 rounded-lg hover:bg-muted transition-colors">
              <button onClick={() => toggle(item.id)} className="flex-shrink-0">
                {item.done ? (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
              <span className={`flex-1 text-sm ${item.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {item.text}
              </span>
              <button
                onClick={() => {
                  removeTodo(item.id);
                  toast({ title: "Task removed" });
                }}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </li>
        ))}
        {displayed.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-3">No tasks for this view</p>
        )}
      </ul>

      <Link to="/todos" className="block text-center text-xs text-primary hover:underline mt-3">
        View all tasks →
      </Link>
    </div>
  );
}
