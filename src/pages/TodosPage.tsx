import { useState, useEffect } from "react";
import { Plus, Search, CheckCircle2, Circle, Trash2, Calendar } from "lucide-react";

interface Todo {
  id: string;
  text: string;
  done: boolean;
  priority: "high" | "medium" | "low";
  dueDate: string;
  list: string;
}

const defaultTodos: Todo[] = [
  { id: "1", text: "Finalize Q2 roadmap", done: false, priority: "high", dueDate: "2026-02-27", list: "Work" },
  { id: "2", text: "Buy groceries", done: false, priority: "low", dueDate: "2026-02-26", list: "Personal" },
  { id: "3", text: "Review pull requests", done: true, priority: "medium", dueDate: "2026-02-25", list: "Work" },
  { id: "4", text: "Schedule dentist appointment", done: false, priority: "medium", dueDate: "2026-02-28", list: "Personal" },
  { id: "5", text: "Write blog post draft", done: false, priority: "high", dueDate: "2026-03-01", list: "Work" },
];

const priorityClasses: Record<string, string> = {
  high: "priority-high",
  medium: "priority-medium",
  low: "priority-low",
};

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : defaultTodos;
  });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "today" | "upcoming" | "completed">("all");
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState("");
  const [newPriority, setNewPriority] = useState<"high" | "medium" | "low">("medium");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const toggle = (id: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const removeTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const addTodo = () => {
    if (!newText.trim()) return;
    setTodos((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: newText,
        done: false,
        priority: newPriority,
        dueDate: new Date().toISOString().split("T")[0],
        list: "General",
      },
    ]);
    setNewText("");
    setAdding(false);
  };

  const today = new Date().toISOString().split("T")[0];
  const filtered = todos
    .filter((t) => {
      if (filter === "today") return t.dueDate === today;
      if (filter === "completed") return t.done;
      if (filter === "upcoming") return !t.done && t.dueDate > today;
      return true;
    })
    .filter((t) => t.text.toLowerCase().includes(search.toLowerCase()));

  const doneCount = todos.filter((t) => t.done).length;
  const pct = todos.length ? Math.round((doneCount / todos.length) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">To-Do Lists</h1>
          <p className="text-sm text-muted-foreground mt-1">{doneCount}/{todos.length} completed ({pct}%)</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Progress */}
      <div className="dashboard-card mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Overall Progress</span>
          <span className="text-sm font-medium text-primary">{pct}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex bg-muted rounded-lg p-0.5">
          {(["all", "today", "upcoming", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Add form */}
      {adding && (
        <div className="dashboard-card mb-4">
          <div className="flex gap-2">
            <input
              className="flex-1 bg-muted border-none rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Task name..."
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              autoFocus
            />
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as any)}
              className="bg-muted rounded-lg px-3 py-2 text-sm text-foreground border-none focus:outline-none"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button onClick={addTodo} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
              Add
            </button>
            <button onClick={() => setAdding(false)} className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Task list */}
      <div className="space-y-2">
        {filtered.map((todo) => (
          <div
            key={todo.id}
            className={`dashboard-card !p-4 flex items-center gap-3 group ${
              todo.done ? "opacity-60" : ""
            }`}
          >
            <button onClick={() => toggle(todo.id)}>
              {todo.done ? (
                <CheckCircle2 className="w-5 h-5 text-success" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
            <span className={`flex-1 text-sm ${todo.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
              {todo.text}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityClasses[todo.priority]}`}>
              {todo.priority}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {todo.dueDate}
            </span>
            <button
              onClick={() => removeTodo(todo.id)}
              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tasks found</p>
          </div>
        )}
      </div>
    </div>
  );
}
