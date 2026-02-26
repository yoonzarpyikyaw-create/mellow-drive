import { useState } from "react";
import { Plus, Search, CheckCircle2, Circle, Trash2, Calendar } from "lucide-react";
import { useTodos } from "@/hooks/useTodos";
import { toast } from "@/hooks/use-toast";

const priorityClasses: Record<string, string> = {
  high: "priority-high",
  medium: "priority-medium",
  low: "priority-low",
};

const listOptions = ["General", "Routine", "Work", "Personal"];

export default function TodosPage() {
  const { todos, toggle, addTodo, removeTodo, setTodos, doneCount, pct, today } = useTodos();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "today" | "upcoming" | "completed">("all");
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState("");
  const [newPriority, setNewPriority] = useState<"high" | "medium" | "low">("medium");
  const [newList, setNewList] = useState("General");

  const handleAdd = () => {
    if (!newText.trim()) return;
    addTodo(newText, newPriority, newList);
    toast({ title: "Task added", description: newText });
    setNewText("");
    setAdding(false);
  };

  const bulkComplete = () => {
    setTodos((prev) => prev.map((t) => ({ ...t, done: true })));
    toast({ title: "All tasks completed!" });
  };

  const bulkDelete = () => {
    const doneIds = todos.filter((t) => t.done).map((t) => t.id);
    setTodos((prev) => prev.filter((t) => !t.done));
    toast({ title: `${doneIds.length} completed tasks removed` });
  };

  const filtered = todos
    .filter((t) => {
      if (filter === "today") return t.dueDate === today;
      if (filter === "completed") return t.done;
      if (filter === "upcoming") return !t.done && t.dueDate > today;
      return true;
    })
    .filter((t) => t.text.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">To-Do Lists</h1>
          <p className="text-sm text-muted-foreground mt-1">{doneCount}/{todos.length} completed ({pct}%)</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={bulkDelete}
            className="px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors"
          >
            Clear Done
          </button>
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
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
                filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Add form */}
      {adding && (
        <div className="dashboard-card mb-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              className="flex-1 bg-muted border-none rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Task name..."
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
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
            <select
              value={newList}
              onChange={(e) => setNewList(e.target.value)}
              className="bg-muted rounded-lg px-3 py-2 text-sm text-foreground border-none focus:outline-none"
            >
              {listOptions.map((l) => <option key={l}>{l}</option>)}
            </select>
            <button onClick={handleAdd} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Add</button>
            <button onClick={() => setAdding(false)} className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Task list */}
      <div className="space-y-2">
        {filtered.map((todo) => (
          <div
            key={todo.id}
            className={`dashboard-card !p-4 flex items-center gap-3 group ${todo.done ? "opacity-60" : ""}`}
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
            <span className="text-xs text-muted-foreground px-1.5 py-0.5 bg-muted rounded">{todo.list}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityClasses[todo.priority]}`}>
              {todo.priority}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {todo.dueDate}
            </span>
            <button
              onClick={() => {
                removeTodo(todo.id);
                toast({ title: "Task removed" });
              }}
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
