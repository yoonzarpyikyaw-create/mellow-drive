import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DailyRoutineCard from "@/components/dashboard/DailyRoutineCard";
import RemindersCard from "@/components/dashboard/RemindersCard";
import HabitTrackerCard from "@/components/dashboard/HabitTrackerCard";
import ProjectsOverviewCard from "@/components/dashboard/ProjectsOverviewCard";
import NotebookPreviewCard from "@/components/dashboard/NotebookPreviewCard";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useTodos } from "@/hooks/useTodos";
import { useNotes } from "@/hooks/useNotes";
import { toast } from "@/hooks/use-toast";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [quickTaskModal, setQuickTaskModal] = useState(false);
  const [quickNoteModal, setQuickNoteModal] = useState(false);
  const [quickTask, setQuickTask] = useState("");
  const [quickNoteTitle, setQuickNoteTitle] = useState("");
  const [quickNoteContent, setQuickNoteContent] = useState("");
  const { addTodo } = useTodos();
  const { addNote } = useNotes();

  const handlers = useMemo(() => ({
    T: () => setQuickTaskModal(true),
    N: () => setQuickNoteModal(true),
  }), []);

  useKeyboardShortcuts(handlers);

  const handleQuickTask = () => {
    if (!quickTask.trim()) return;
    addTodo(quickTask);
    toast({ title: "Task added", description: quickTask });
    setQuickTask("");
    setQuickTaskModal(false);
  };

  const handleQuickNote = () => {
    if (!quickNoteTitle.trim()) return;
    addNote(quickNoteTitle, quickNoteContent);
    toast({ title: "Note saved", description: quickNoteTitle });
    setQuickNoteTitle("");
    setQuickNoteContent("");
    setQuickNoteModal(false);
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{greeting()} 👋</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here's what's happening today · Press <kbd className="px-1 py-0.5 bg-muted border border-border rounded text-xs">T</kbd> for task, <kbd className="px-1 py-0.5 bg-muted border border-border rounded text-xs">N</kbd> for note
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <DailyRoutineCard />
        <RemindersCard />
        <HabitTrackerCard />
        <ProjectsOverviewCard />
        <NotebookPreviewCard />
      </div>

      {/* Quick Task Modal */}
      {quickTaskModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/30" onClick={() => setQuickTaskModal(false)}>
          <div className="bg-card rounded-xl p-6 w-full max-w-md mx-4 shadow-xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-foreground mb-4">Quick Add Task</h2>
            <input
              className="w-full bg-muted rounded-lg px-4 py-3 text-sm text-foreground border-none focus:outline-none focus:ring-2 focus:ring-primary/50 mb-4"
              placeholder="What needs to be done?"
              value={quickTask}
              onChange={(e) => setQuickTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleQuickTask()}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setQuickTaskModal(false)} className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm">Cancel</button>
              <button onClick={handleQuickTask} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Add Task</button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Note Modal */}
      {quickNoteModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/30" onClick={() => setQuickNoteModal(false)}>
          <div className="bg-card rounded-xl p-6 w-full max-w-md mx-4 shadow-xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-foreground mb-4">Quick Add Note</h2>
            <input
              className="w-full bg-muted rounded-lg px-4 py-2 text-sm text-foreground border-none focus:outline-none focus:ring-2 focus:ring-primary/50 mb-3"
              placeholder="Note title..."
              value={quickNoteTitle}
              onChange={(e) => setQuickNoteTitle(e.target.value)}
              autoFocus
            />
            <textarea
              className="w-full bg-muted rounded-lg px-4 py-3 text-sm text-foreground border-none focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none mb-4"
              rows={3}
              placeholder="Write your note..."
              value={quickNoteContent}
              onChange={(e) => setQuickNoteContent(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setQuickNoteModal(false)} className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm">Cancel</button>
              <button onClick={handleQuickNote} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Save Note</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
