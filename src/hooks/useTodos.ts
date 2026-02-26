import { useState, useEffect, useCallback } from "react";

export interface Todo {
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

function loadTodos(): Todo[] {
  const saved = localStorage.getItem("todos");
  return saved ? JSON.parse(saved) : defaultTodos;
}

function saveTodos(todos: Todo[]) {
  localStorage.setItem("todos", JSON.stringify(todos));
  window.dispatchEvent(new Event("todos-updated"));
}

export function useTodos() {
  const [todos, setTodosState] = useState<Todo[]>(loadTodos);

  const setTodos = useCallback((updater: Todo[] | ((prev: Todo[]) => Todo[])) => {
    setTodosState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveTodos(next);
      return next;
    });
  }, []);

  useEffect(() => {
    const handler = () => setTodosState(loadTodos());
    window.addEventListener("todos-updated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("todos-updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const toggle = useCallback((id: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }, [setTodos]);

  const addTodo = useCallback((text: string, priority: "high" | "medium" | "low" = "medium", list = "General") => {
    if (!text.trim()) return;
    setTodos((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text,
        done: false,
        priority,
        dueDate: new Date().toISOString().split("T")[0],
        list,
      },
    ]);
  }, [setTodos]);

  const removeTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, [setTodos]);

  const today = new Date().toISOString().split("T")[0];
  const doneCount = todos.filter((t) => t.done).length;
  const pct = todos.length ? Math.round((doneCount / todos.length) * 100) : 0;
  const todayTodos = todos.filter((t) => t.dueDate === today);

  return { todos, setTodos, toggle, addTodo, removeTodo, doneCount, pct, todayTodos, today };
}
